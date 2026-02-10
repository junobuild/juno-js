/**
 * @vitest-environment jsdom
 */

import {ECDSAKeyIdentity, Ed25519KeyIdentity} from '@icp-sdk/core/identity';
import {CONTEXT_KEY, GITHUB_PROVIDER} from '../../delegation/_constants';
import * as authApi from '../../delegation/api/auth.api';
import {authenticate} from '../../delegation/authenticate';
import {
  AuthenticationInvalidStateError,
  AuthenticationUndefinedJwtError,
  AuthenticationUrlHashError,
  GetDelegationError,
  GetDelegationRetryError
} from '../../delegation/errors';
import * as githubApiModule from '../../delegation/providers/github/_api';
import {
  type AuthenticationResult,
  type GetDelegationArgs,
  type GetDelegationResult
} from '../../delegation/types/actor';
import {AuthenticatedIdentity, AuthParameters} from '../../delegation/types/authenticate';
import {stringifyContext} from '../../delegation/utils/session-storage.utils';
import * as sessionUtils from '../../delegation/utils/session.utils';
import {mockUserDoc} from '../mocks/doc.mock';
import {mockSatelliteIdText} from '../mocks/principal.mock';

vi.mock('../api/auth.api', () => ({
  authenticate: vi.fn(),
  getDelegation: vi.fn()
}));

vi.mock('../providers/github/_api', () => ({
  finalizeOAuth: vi.fn()
}));

vi.mock('../utils/session.utils', async (importOriginal) => {
  const actual = await importOriginal<typeof sessionUtils>();
  return {
    ...actual,
    generateIdentity: vi.fn()
  };
});

describe('authenticate', () => {
  const auth: AuthParameters = {satellite: {satelliteId: mockSatelliteIdText}};

  const user_key = new Uint8Array([9, 9, 9]);
  const expiration = 123456789n;
  const pubkey = new Uint8Array([7, 7]);
  const signature = new Uint8Array([1, 2, 3]);
  const targetsNone: [] = [];

  const mockPublicKey = new Uint8Array([0xaa, 0xbb, 0xcc]);

  const mockGenerateIdentityReturn: AuthenticatedIdentity = {
    identity: {tag: 'id'},
    delegationChain: {tag: 'chain'}
  } as unknown as AuthenticatedIdentity;

  const mockAuthenticatedSession = {
    identity: mockGenerateIdentityReturn,
    data: {doc: mockUserDoc}
  };

  const seedContext = (state: string) => {
    const caller = Ed25519KeyIdentity.generate();
    const salt = new Uint8Array([1, 2, 3, 4]);
    const json = stringifyContext({caller, salt, state});
    sessionStorage.setItem(CONTEXT_KEY, json);
    return {salt, caller, state};
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.restoreAllMocks();

    vi.spyOn(ECDSAKeyIdentity, 'generate').mockResolvedValue({
      getPublicKey: () => ({toDer: () => mockPublicKey})
    } as ECDSAKeyIdentity);

    vi.spyOn(global, 'setInterval').mockImplementation((cb: any, ms?: number) => {
      return setTimeout(cb, ms);
    });

    vi.spyOn(sessionUtils, 'generateIdentity').mockReturnValue(mockGenerateIdentityReturn);

    let hrefStore = 'https://app.test';
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      get href() {
        return hrefStore;
      },
      set href(v: string) {
        hrefStore = v;
      },
      get hash() {
        return new URL(hrefStore).hash;
      },
      set hash(v: string) {
        hrefStore = `https://app.test/${v.startsWith('#') ? v : `#${v}`}`;
      },
      get search() {
        return new URL(hrefStore).search;
      },
      origin: 'https://app.test'
    } as unknown as Location);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  describe('Google', () => {
    describe('With credentials', () => {
      it('should pass through to session flow and returns identity', async () => {
        const {salt} = seedContext('STATE123');

        vi.mocked(authApi.authenticate).mockResolvedValue({
          Ok: {delegation: {user_key, expiration}, doc: mockUserDoc}
        } as AuthenticationResult);

        vi.mocked(authApi.getDelegation).mockResolvedValue({
          Ok: {delegation: {pubkey, expiration, targets: targetsNone}, signature}
        } as GetDelegationResult);

        const p = authenticate({
          google: {
            credentials: {jwt: 'jwt-123'},
            auth
          }
        });

        await vi.runAllTimersAsync();
        const result = await p;

        expect(result).toStrictEqual(mockAuthenticatedSession);

        expect(authApi.authenticate).toHaveBeenCalledWith({
          args: {OpenId: {jwt: 'jwt-123', session_key: mockPublicKey, salt}},
          actorParams: {auth, identity: expect.anything()}
        });

        const expectedArgs: GetDelegationArgs = {
          OpenId: {jwt: 'jwt-123', session_key: mockPublicKey, salt, expiration}
        };
        expect(authApi.getDelegation).toHaveBeenCalledWith({
          args: expectedArgs,
          actorParams: {auth, identity: expect.anything()}
        });
      });
    });

    describe('With redirect', () => {
      it('should success with valid state and id_token', async () => {
        const {salt} = seedContext('SAVED_STATE');

        vi.mocked(authApi.authenticate).mockResolvedValue({
          Ok: {delegation: {user_key, expiration}, doc: mockUserDoc}
        } as AuthenticationResult);

        vi.mocked(authApi.getDelegation).mockResolvedValue({
          Ok: {delegation: {pubkey, expiration, targets: targetsNone}, signature}
        } as GetDelegationResult);

        window.location.hash = '#id_token=IDTOKEN_ABC&state=SAVED_STATE';

        const p = authenticate({google: {redirect: null, auth}});

        await vi.advanceTimersByTimeAsync(0);
        await vi.runOnlyPendingTimersAsync();

        const res = await p;

        expect(res).toStrictEqual(mockAuthenticatedSession);

        expect(authApi.authenticate).toHaveBeenCalledWith({
          args: {OpenId: {jwt: 'IDTOKEN_ABC', session_key: mockPublicKey, salt}},
          actorParams: {auth, identity: expect.anything()}
        });
      });

      it('should throws when no hash', async () => {
        seedContext('SAVED_STATE');
        window.location.hash = '';

        await expect(authenticate({google: {redirect: null, auth}})).rejects.toBeInstanceOf(
          AuthenticationUrlHashError
        );
      });

      it('should throws when state mismatch', async () => {
        seedContext('SAVED_STATE');
        window.location.hash = '#id_token=JWT123&state=OTHER_STATE';

        await expect(authenticate({google: {redirect: null, auth}})).rejects.toBeInstanceOf(
          AuthenticationInvalidStateError
        );
      });

      it('should throws when id_token missing', async () => {
        seedContext('SAVED_STATE');
        window.location.hash = '#state=SAVED_STATE';

        await expect(authenticate({google: {redirect: null, auth}})).rejects.toBeInstanceOf(
          AuthenticationUndefinedJwtError
        );
      });

      it('should bubbles GetDelegationError', async () => {
        seedContext('SAVED_STATE');

        vi.mocked(authApi.authenticate).mockResolvedValue({
          Ok: {delegation: {user_key, expiration}}
        } as AuthenticationResult);

        vi.mocked(authApi.getDelegation).mockResolvedValue({
          Err: {DeriveSeedFailed: 'boom'}
        });

        window.location.hash = '#id_token=IDTOKEN_ABC&state=SAVED_STATE';

        const p = authenticate({google: {redirect: null, auth}});
        const guarded = p.catch((e) => e);

        await vi.advanceTimersByTimeAsync(0);
        await expect(guarded).resolves.toBeInstanceOf(GetDelegationError);
        expect(authApi.authenticate).toHaveBeenCalled();
      });

      it('should bubble GetDelegationRetryError after retries', async () => {
        seedContext('SAVED_STATE');

        vi.mocked(authApi.authenticate).mockResolvedValue({
          Ok: {delegation: {user_key, expiration}}
        } as AuthenticationResult);

        vi.mocked(authApi.getDelegation).mockResolvedValue({Err: {NoSuchDelegation: null}});

        window.location.hash = '#id_token=IDTOKEN_ABC&state=SAVED_STATE';

        const p = authenticate({google: {redirect: null, auth}});
        const guarded = p.catch((e) => e);

        await vi.advanceTimersByTimeAsync(0);
        await vi.advanceTimersByTimeAsync(1000);
        await vi.advanceTimersByTimeAsync(2000);
        await vi.advanceTimersByTimeAsync(3000);
        await vi.advanceTimersByTimeAsync(4000);

        await expect(guarded).resolves.toBeInstanceOf(GetDelegationRetryError);
        expect(authApi.getDelegation).toHaveBeenCalledTimes(5);
      });
    });
  });

  describe('GitHub', () => {
    describe('With redirect', () => {
      beforeEach(() => {
        let hrefStore = 'https://app.test?code=CODE123&state=STATE123';
        vi.spyOn(window, 'location', 'get').mockReturnValue({
          ...window.location,
          get href() {
            return hrefStore;
          },
          set href(v: string) {
            hrefStore = v;
          },
          get search() {
            return new URL(hrefStore).search;
          },
          origin: 'https://app.test'
        } as unknown as Location);
      });

      it('should success with valid code and state', async () => {
        const {salt} = seedContext('STATE123');

        vi.mocked(githubApiModule.finalizeOAuth).mockResolvedValue({
          success: {token: 'TOKEN_ABC'}
        });

        vi.mocked(authApi.authenticate).mockResolvedValue({
          Ok: {delegation: {user_key, expiration}, doc: mockUserDoc}
        } as AuthenticationResult);

        vi.mocked(authApi.getDelegation).mockResolvedValue({
          Ok: {delegation: {pubkey, expiration, targets: targetsNone}, signature}
        } as GetDelegationResult);

        const p = authenticate({github: {redirect: null, auth}});

        await vi.advanceTimersByTimeAsync(0);
        await vi.runOnlyPendingTimersAsync();

        const res = await p;

        expect(res).toStrictEqual(mockAuthenticatedSession);

        expect(githubApiModule.finalizeOAuth).toHaveBeenCalledWith({
          url: GITHUB_PROVIDER.finalizeUrl,
          body: {code: 'CODE123', state: 'STATE123'}
        });

        expect(authApi.authenticate).toHaveBeenCalledWith({
          args: {OpenId: {jwt: 'TOKEN_ABC', session_key: mockPublicKey, salt}},
          actorParams: {auth, identity: expect.anything()}
        });
      });

      it('should throw error when finalizeOAuth returns error', async () => {
        seedContext('STATE123');

        const error = new Error('Finalize failed');
        vi.mocked(githubApiModule.finalizeOAuth).mockResolvedValue({error});

        await expect(authenticate({github: {redirect: null, auth}})).rejects.toBe(error);
      });

      it('should throw AuthenticationUndefinedJwtError when token is empty', async () => {
        seedContext('STATE123');

        vi.mocked(githubApiModule.finalizeOAuth).mockResolvedValue({
          success: {token: ''}
        });

        await expect(authenticate({github: {redirect: null, auth}})).rejects.toThrow(
          AuthenticationUndefinedJwtError
        );
      });

      it('should bubbles GetDelegationError', async () => {
        seedContext('STATE123');

        vi.mocked(githubApiModule.finalizeOAuth).mockResolvedValue({
          success: {token: 'TOKEN_ABC'}
        });

        vi.mocked(authApi.authenticate).mockResolvedValue({
          Ok: {delegation: {user_key, expiration}}
        } as AuthenticationResult);

        vi.mocked(authApi.getDelegation).mockResolvedValue({
          Err: {DeriveSeedFailed: 'boom'}
        });

        const p = authenticate({github: {redirect: null, auth}});
        const guarded = p.catch((e) => e);

        await vi.advanceTimersByTimeAsync(0);
        await expect(guarded).resolves.toBeInstanceOf(GetDelegationError);
        expect(authApi.authenticate).toHaveBeenCalled();
      });

      it('should bubble GetDelegationRetryError after retries', async () => {
        seedContext('STATE123');

        vi.mocked(githubApiModule.finalizeOAuth).mockResolvedValue({
          success: {token: 'TOKEN_ABC'}
        });

        vi.mocked(authApi.authenticate).mockResolvedValue({
          Ok: {delegation: {user_key, expiration}}
        } as AuthenticationResult);

        vi.mocked(authApi.getDelegation).mockResolvedValue({Err: {NoSuchDelegation: null}});

        const p = authenticate({github: {redirect: null, auth}});
        const guarded = p.catch((e) => e);

        await vi.advanceTimersByTimeAsync(0);
        await vi.advanceTimersByTimeAsync(1000);
        await vi.advanceTimersByTimeAsync(2000);
        await vi.advanceTimersByTimeAsync(3000);
        await vi.advanceTimersByTimeAsync(4000);

        await expect(guarded).resolves.toBeInstanceOf(GetDelegationRetryError);
        expect(authApi.getDelegation).toHaveBeenCalledTimes(5);
      });
    });
  });
});
