import * as actor from '@junobuild/ic-client/actor';
import * as actorApi from '../../api/_actor.api';
import {authenticate, getDelegation} from '../../api/auth.api';
import {
  ActorParameters,
  AuthenticationArgs,
  AuthenticationResult,
  GetDelegationArgs,
  GetDelegationResult
} from '../../types/actor';
import {mockIdentity} from '../mocks/identity.mock';
import {mockSatelliteIdPrincipal} from '../mocks/principal.mock';

vi.mock(import('@junobuild/ic-client/actor'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getSatelliteActor: vi.fn()
  };
});

const mockActor = {
  authenticate: vi.fn(),
  get_delegation: vi.fn()
};

describe('proposals.api', () => {
  const actorParams: ActorParameters = {
    auth: {satellite: {satelliteId: mockSatelliteIdPrincipal}},
    identity: mockIdentity
  };

  beforeEach(() => {
    vi.restoreAllMocks();

    // @ts-ignore
    vi.mocked(actor.getSatelliteActor).mockResolvedValue(mockActor);
  });

  describe('authenticate', () => {
    const authArgs: AuthenticationArgs = {
      OpenId: {
        jwt: '123',
        salt: Uint8Array.from([4, 5, 6]),
        session_key: Uint8Array.from([7, 8, 9])
      }
    };

    it('should return AuthenticationResult on success', async () => {
      const expected: AuthenticationResult = {ok: true} as unknown as AuthenticationResult;
      mockActor.authenticate.mockResolvedValue(expected);

      let spy = vi.spyOn(actorApi, 'getAuthActor');

      const result = await authenticate({actorParams, args: authArgs});

      expect(result).toBe(expected);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(actorParams);

      expect(mockActor.authenticate).toHaveBeenCalledTimes(1);
      expect(mockActor.authenticate).toHaveBeenCalledWith(authArgs);
    });

    it('should bubble errors from the actor', async () => {
      const err = new Error('authenticate failed');
      mockActor.authenticate.mockRejectedValueOnce(err);

      await expect(authenticate({actorParams, args: authArgs})).rejects.toThrow(err);
    });
  });

  describe('getDelegation', () => {
    const delegationArgs: GetDelegationArgs = {
      OpenId: {
        jwt: '123',
        salt: Uint8Array.from([4, 5, 6]),
        session_key: Uint8Array.from([7, 8, 9]),
        expiration: 444n
      }
    };

    it('should return GetDelegationResult on success', async () => {
      const expected: GetDelegationResult = {
        ok: {signed_delegation: {}}
      } as unknown as GetDelegationResult;
      mockActor.get_delegation.mockResolvedValue(expected);

      let spy = vi.spyOn(actorApi, 'getAuthActor');

      const result = await getDelegation({actorParams, args: delegationArgs});

      expect(result).toBe(expected);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(actorParams);

      expect(mockActor.get_delegation).toHaveBeenCalledTimes(1);
      expect(mockActor.get_delegation).toHaveBeenCalledWith(delegationArgs);
    });

    it('should bubble errors from the actor', async () => {
      const err = new Error('get_delegation failed');
      mockActor.get_delegation.mockRejectedValueOnce(err);

      await expect(getDelegation({actorParams, args: delegationArgs})).rejects.toThrow(err);
    });
  });
});
