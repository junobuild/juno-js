import type {SatelliteActor} from '@junobuild/ic-client/actor';
import * as icClient from '@junobuild/ic-client/actor';
import {getAutomationActor} from '../../../automation/api/_actor.api';
import type {AutomationParameters} from '../../../automation/types/authenticate';
import {mockIdentity} from '../../mocks/identity.mock';
import {mockSatelliteIdPrincipal} from '../../mocks/principal.mock';

vi.mock('@junobuild/ic-client/actor', () => {
  return {
    getSatelliteActor: vi.fn()
  };
});

describe('getAutomationActor', () => {
  const mockSatelliteActor = {} as unknown as SatelliteActor;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();

    vi.mocked(icClient.getSatelliteActor).mockResolvedValue(mockSatelliteActor);
  });

  it('should return a Satellite actor when cdn has "satellite"', async () => {
    const automation: AutomationParameters = {
      satellite: {satelliteId: mockSatelliteIdPrincipal}
    };

    const actor = await getAutomationActor({automation, identity: mockIdentity});

    expect(icClient.getSatelliteActor).toHaveBeenCalledOnce();
    expect(icClient.getSatelliteActor).toHaveBeenCalledWith({
      ...automation.satellite,
      identity: mockIdentity
    });

    expect(actor).toBe(mockSatelliteActor);
  });
});
