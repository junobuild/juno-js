import * as actor from '@junobuild/ic-client/actor';
import * as actorApi from '../../../automation/api/_actor.api';
import {authenticateAutomation} from '../../../automation/api/automation.api';
import type {
  ActorParameters,
  AutomationArgs,
  AutomationResult
} from '../../../automation/types/actor';
import {mockIdentity} from '../../mocks/identity.mock';
import {mockSatelliteIdPrincipal} from '../../mocks/principal.mock';

vi.mock(import('@junobuild/ic-client/actor'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getSatelliteActor: vi.fn()
  };
});

const mockActor = {
  authenticate_automation: vi.fn()
};

describe('automation.api', () => {
  const actorParams: ActorParameters = {
    automation: {satellite: {satelliteId: mockSatelliteIdPrincipal}},
    identity: mockIdentity
  };

  beforeEach(() => {
    vi.restoreAllMocks();

    // @ts-ignore
    vi.mocked(actor.getSatelliteActor).mockResolvedValue(mockActor);
  });

  describe('authenticateAutomation', () => {
    const authArgs: AutomationArgs = {
      OpenId: {
        jwt: '123',
        salt: Uint8Array.from([4, 5, 6])
      }
    };

    it('should return AutomationResult on success', async () => {
      const expected: AutomationResult = {ok: true} as unknown as AutomationResult;
      mockActor.authenticate_automation.mockResolvedValue(expected);

      let spy = vi.spyOn(actorApi, 'getAutomationActor');

      const result = await authenticateAutomation({actorParams, args: authArgs});

      expect(result).toBe(expected);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(actorParams);

      expect(mockActor.authenticate_automation).toHaveBeenCalledTimes(1);
      expect(mockActor.authenticate_automation).toHaveBeenCalledWith(authArgs);
    });

    it('should bubble errors from the actor', async () => {
      const err = new Error('authenticate failed');
      mockActor.authenticate_automation.mockRejectedValueOnce(err);

      await expect(authenticateAutomation({actorParams, args: authArgs})).rejects.toThrow(err);
    });
  });
});
