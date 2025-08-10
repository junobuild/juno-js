import {idlFactorySputnik} from '@junobuild/ic-client';
import * as actorApi from '../../api/actor.api';
import {getSatelliteExtendedActor} from '../../services/functions.services';
import {mockIdentity, mockSatellite} from '../mocks/core.mock';

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
