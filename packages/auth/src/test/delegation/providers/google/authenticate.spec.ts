/**
 * @vitest-environment jsdom
 */

import {ECDSAKeyIdentity, Ed25519KeyIdentity} from '@icp-sdk/core/identity';
import * as authApi from '../../../../delegation/api/auth.api';
import {
  AuthenticationInvalidStateError,
  AuthenticationUndefinedJwtError,
  AuthenticationUrlHashError,
  GetDelegationError,
  GetDelegationRetryError
} from '../../../../delegation/errors';
import {authenticateGoogleWithRedirect} from '../../../../delegation/providers/google/authenticate';
import {
  type AuthenticationResult,
  type GetDelegationArgs,
  type GetDelegationResult
} from '../../../../delegation/types/actor';
import {AuthenticatedIdentity, AuthParameters} from '../../../../delegation/types/authenticate';
import type {OpenIdAuthContext} from '../../../../delegation/types/context';
import * as sessionUtils from '../../../../delegation/utils/session.utils';
import {mockUserDoc} from '../../../mocks/doc.mock';
import {mockSatelliteIdText} from '../../../mocks/principal.mock';

vi.mock('../../../../delegation/api/auth.api', () => ({
  authenticate: vi.fn(),
  getDelegation: vi.fn()
}));

vi.mock('../../../../delegation/utils/session.utils', async (importOriginal) => {
  const actual = await importOriginal<typeof sessionUtils>();
  return {
    ...actual,
    generateIdentity: vi.fn()
  };
});

describe('authenticateGoogleWithRedirect', () => {
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

  const createContext = (state: string): OpenIdAuthContext => {
    const salt = new Uint8Array([1, 2, 3, 4]);
    return {salt, state, caller: Ed25519KeyIdentity.generate()};
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
      origin: 'https://app.test'
    } as unknown as Location);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should authenticate successfully with valid state and id_token', async () => {
    const context = createContext('SAVED_STATE');

    vi.mocked(authApi.authenticate).mockResolvedValue({
      Ok: {delegation: {user_key, expiration}, doc: mockUserDoc}
    } as AuthenticationResult);

    vi.mocked(authApi.getDelegation).mockResolvedValue({
      Ok: {delegation: {pubkey, expiration, targets: targetsNone}, signature}
    } as GetDelegationResult);

    window.location.hash = '#id_token=IDTOKEN_ABC&state=SAVED_STATE';

    const p = authenticateGoogleWithRedirect({auth, context});

    await vi.advanceTimersByTimeAsync(0);
    await vi.runOnlyPendingTimersAsync();

    const res = await p;

    expect(res).toStrictEqual(mockAuthenticatedSession);

    expect(authApi.authenticate).toHaveBeenCalledWith({
      args: {OpenId: {jwt: 'IDTOKEN_ABC', session_key: mockPublicKey, salt: context.salt}},
      actorParams: {auth, identity: expect.anything()}
    });

    const expectedArgs: GetDelegationArgs = {
      OpenId: {jwt: 'IDTOKEN_ABC', session_key: mockPublicKey, salt: context.salt, expiration}
    };

    expect(authApi.getDelegation).toHaveBeenCalledWith({
      args: expectedArgs,
      actorParams: {auth, identity: expect.anything()}
    });
  });

  it('should throw AuthenticationUrlHashError when no hash', async () => {
    const context = createContext('SAVED_STATE');
    window.location.hash = '';

    await expect(authenticateGoogleWithRedirect({auth, context})).rejects.toThrow(
      AuthenticationUrlHashError
    );
  });

  it('should throw AuthenticationInvalidStateError when state mismatch', async () => {
    const context = createContext('SAVED_STATE');
    window.location.hash = '#id_token=JWT123&state=OTHER_STATE';

    await expect(authenticateGoogleWithRedirect({auth, context})).rejects.toThrow(
      AuthenticationInvalidStateError
    );
  });

  it('should throw AuthenticationUndefinedJwtError when id_token missing', async () => {
    const context = createContext('SAVED_STATE');
    window.location.hash = '#state=SAVED_STATE';

    await expect(authenticateGoogleWithRedirect({auth, context})).rejects.toThrow(
      AuthenticationUndefinedJwtError
    );
  });

  it('should bubble GetDelegationError from authenticateSession', async () => {
    const context = createContext('SAVED_STATE');

    vi.mocked(authApi.authenticate).mockResolvedValue({
      Ok: {delegation: {user_key, expiration}}
    } as AuthenticationResult);

    vi.mocked(authApi.getDelegation).mockResolvedValue({
      Err: {DeriveSeedFailed: 'boom'}
    });

    window.location.hash = '#id_token=IDTOKEN_ABC&state=SAVED_STATE';

    const p = authenticateGoogleWithRedirect({auth, context});
    const guarded = p.catch((e) => e);

    await vi.advanceTimersByTimeAsync(0);

    await expect(guarded).resolves.toBeInstanceOf(GetDelegationError);
    expect(authApi.authenticate).toHaveBeenCalled();
  });

  it('should bubble GetDelegationRetryError after retries', async () => {
    const context = createContext('SAVED_STATE');

    vi.mocked(authApi.authenticate).mockResolvedValue({
      Ok: {delegation: {user_key, expiration}}
    } as AuthenticationResult);

    vi.mocked(authApi.getDelegation).mockResolvedValue({Err: {NoSuchDelegation: null}});

    window.location.hash = '#id_token=IDTOKEN_ABC&state=SAVED_STATE';

    const p = authenticateGoogleWithRedirect({auth, context});
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
