import {idlFactorySputnik} from '../../api/_actor.factory';
import * as actorApi from '../../api/actor.api';
import {getSatelliteExtendedActor} from '../../services/functions.services';
import {mockIdentity, mockSatellite} from '../mocks/mocks';

describe('satellite.services', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns actor using getSatelliteExtendedActorApi', async () => {
    const mockActor = {mock: true} as any;
    vi.spyOn(actorApi, 'getSatelliteExtendedActor').mockResolvedValue(mockActor);

    const actor = await getSatelliteExtendedActor({
      idlFactory: idlFactorySputnik,
      satellite: mockSatellite
    });

    expect(actor).toBe(mockActor);
    expect(actorApi.getSatelliteExtendedActor).toHaveBeenCalledOnce();
    expect(actorApi.getSatelliteExtendedActor).toHaveBeenCalledWith({
      idlFactory: idlFactorySputnik,
      ...mockSatellite,
      identity: mockIdentity
    });
  });
});
