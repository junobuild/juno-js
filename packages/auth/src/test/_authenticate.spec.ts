import {Delegation, ECDSAKeyIdentity} from '@dfinity/identity';
import {MockInstance} from 'vitest';
import {authenticate} from '../_authenticate';
import * as authApi from '../api/auth.api';
import {AuthenticationError, GetDelegationError, GetDelegationRetryError} from '../errors';
import {
  type AuthenticationResult,
  AuthParameters,
  GetDelegationArgs,
  type GetDelegationResult
} from '../types/actor';
import {AuthenticatedIdentity} from '../types/authenticate';
import {OpenIdAuthContext} from '../types/context';
import * as authenticateUtils from '../utils/authenticate.utils';
import {mockIdentity} from './mocks/identity.mock';
import {mockSatelliteIdText} from './mocks/principal.mock';

vi.mock('../api/auth.api', () => ({
  authenticate: vi.fn(),
  getDelegation: vi.fn()
}));

vi.mock('../utils/authenticate.utils', async (importOriginal) => {
  const actual = await importOriginal<typeof authenticateUtils>();
  return {
    ...actual,
    generateIdentity: vi.fn()
  };
});

describe('_authenticate', () => {
  const jwt = '123456778';
  const caller = mockIdentity;
  const salt = new Uint8Array([1, 2, 3, 4]);
  const context: Omit<OpenIdAuthContext, 'state'> = {caller, salt};

  const auth: AuthParameters = {
    satellite: {satelliteId: mockSatelliteIdText}
  };

  const authArgs = {jwt, context, auth};

  const user_key = new Uint8Array([9, 9, 9]);
  const expiration = 123456789n;

  const pubkey = new Uint8Array([7, 7]);
  const signature = [1, 2, 3];
  const targetsNone: [] = [];

  let generateSpy: MockInstance;
  let genReturn: AuthenticatedIdentity;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.restoreAllMocks();

    vi.spyOn(ECDSAKeyIdentity, 'generate').mockResolvedValue({
      getPublicKey: () => ({
        toDer: () => new Uint8Array([0xaa, 0xbb, 0xcc])
      })
    } as ECDSAKeyIdentity);

    vi.spyOn(global, 'setInterval').mockImplementation((cb: any, ms?: number) => {
      return setTimeout(cb, ms);
    });

    genReturn = {
      identity: {tag: 'id'},
      delegationChain: {tag: 'chain'}
    } as unknown as AuthenticatedIdentity;
    generateSpy = vi.spyOn(authenticateUtils, 'generateIdentity').mockReturnValue(genReturn);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should build delegations and returns generateIdentity result', async () => {
    vi.mocked(authApi.authenticate).mockResolvedValue({
      Ok: {
        delegation: {user_key, expiration}
      }
    } as AuthenticationResult);

    vi.mocked(authApi.getDelegation).mockResolvedValue({
      Ok: {
        delegation: {
          pubkey,
          expiration,
          targets: targetsNone
        },
        signature
      }
    } as GetDelegationResult);

    const resultPromise = authenticate(authArgs);

    await vi.runAllTimersAsync();

    const result = await resultPromise;

    expect(result).toBe(genReturn);

    // authenticate called with expected args
    expect(authApi.authenticate).toHaveBeenCalledTimes(1);
    expect(authApi.authenticate).toHaveBeenCalledWith({
      args: {
        OpenId: {
          jwt,
          session_key: new Uint8Array([0xaa, 0xbb, 0xcc]),
          salt
        }
      },
      actorParams: {auth, identity: caller}
    });

    // getDelegation called with expected args
    expect(authApi.getDelegation).toHaveBeenCalledTimes(1);
    const expectedArgs: GetDelegationArgs = {
      OpenId: {
        jwt,
        session_key: new Uint8Array([0xaa, 0xbb, 0xcc]),
        salt,
        expiration
      }
    };
    expect(authApi.getDelegation).toHaveBeenCalledWith({
      args: expectedArgs,
      actorParams: {auth, identity: caller}
    });

    // generateIdentity called with correct delegations shape
    expect(generateSpy).toHaveBeenCalledTimes(1);
    const [{sessionKey, delegations}] = generateSpy.mock.calls[0];

    expect(sessionKey).toBeDefined();
    expect(delegations).toBeDefined();

    const [delegUserKey, signedDelegations] = delegations as any;
    expect(Array.from(delegUserKey)).toEqual(Array.from(user_key));
    expect(Array.isArray(signedDelegations)).toBe(true);
    expect(signedDelegations).toHaveLength(1);

    // Delegation instance inspection
    const {delegation, signature: sigOut} = signedDelegations[0];
    expect(delegation).toBeInstanceOf(Delegation);
    expect(Array.from(delegation.pubkey)).toEqual(Array.from(pubkey));
    expect(delegation.expiration).toBe(expiration);
    expect(delegation.targets).toBeUndefined();
    expect(Array.from(sigOut)).toEqual(signature);
  });

  it('should retry on NoSuchDelegation and succeeds later', async () => {
    vi.mocked(authApi.authenticate).mockResolvedValue({
      Ok: {delegation: {user_key, expiration}}
    } as AuthenticationResult);

    // First two attempts Err.NoSuchDelegation, third attempt Ok
    vi.mocked(authApi.getDelegation)
      .mockResolvedValueOnce({Err: {NoSuchDelegation: null}})
      .mockResolvedValueOnce({Err: {NoSuchDelegation: null}})
      .mockResolvedValueOnce({
        Ok: {
          delegation: {pubkey, expiration, targets: targetsNone},
          signature
        }
      } as GetDelegationResult);

    const p = authenticate(authArgs);

    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(1000);
    await vi.runOnlyPendingTimersAsync();

    const result = await p;

    expect(result).toBe(genReturn);
    expect(authApi.getDelegation).toHaveBeenCalledTimes(3);
  });

  it('should continue retrying on GetCachedJwks and then succeeds', async () => {
    vi.mocked(authApi.authenticate).mockResolvedValue({
      Ok: {delegation: {user_key, expiration}}
    } as AuthenticationResult);

    vi.mocked(authApi.getDelegation)
      .mockResolvedValueOnce({Err: {GetCachedJwks: null}})
      .mockResolvedValueOnce({
        Ok: {delegation: {pubkey, expiration, targets: targetsNone}, signature}
      } as GetDelegationResult);

    const p = authenticate(authArgs);

    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(1000);
    await vi.runOnlyPendingTimersAsync();

    await expect(p).resolves.toBe(genReturn);

    expect(authApi.getDelegation).toHaveBeenCalledTimes(2);
  });

  it('should throw AuthenticationError when authenticateApi returns Err', async () => {
    vi.mocked(authApi.authenticate).mockResolvedValue({
      Err: {RegisterUser: 'Error'}
    });

    await expect(authenticate(authArgs)).rejects.toBeInstanceOf(AuthenticationError);
    expect(authApi.getDelegation).not.toHaveBeenCalled();
    expect(generateSpy).not.toHaveBeenCalled();
  });

  it('should throw GetDelegationError when getDelegation returns other Err', async () => {
    vi.mocked(authApi.authenticate).mockResolvedValue({
      Ok: {delegation: {user_key, expiration}}
    } as AuthenticationResult);

    vi.mocked(authApi.getDelegation).mockResolvedValue({
      Err: {DeriveSeedFailed: 'Error'}
    });

    const p = authenticate(authArgs);

    const guarded = p.catch(e => e);

    await vi.advanceTimersByTimeAsync(0);

    await expect(guarded).resolves.toBeInstanceOf(GetDelegationError);
    expect(generateSpy).not.toHaveBeenCalled();
  });

  it('throws GetDelegationRetryError after exhausting retries', async () => {
    vi.mocked(authApi.authenticate).mockResolvedValue({
      Ok: {delegation: {user_key, expiration}}
    } as AuthenticationResult);

    vi.mocked(authApi.getDelegation).mockResolvedValue({Err: {NoSuchDelegation: null}});

    const p = authenticate(authArgs);

    const guarded = p.catch(e => e);

    // backoffs: i = 0,1,2,3,4 (0ms, 1000ms, 2000ms, 3000ms, 4000ms)
    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(2000);
    await vi.advanceTimersByTimeAsync(3000);
    await vi.advanceTimersByTimeAsync(4000);

    await expect(guarded).resolves.toBeInstanceOf(GetDelegationRetryError);
    expect(authApi.getDelegation).toHaveBeenCalledTimes(5);
    expect(generateSpy).not.toHaveBeenCalled();
  });
});
