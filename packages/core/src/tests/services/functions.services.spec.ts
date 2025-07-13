import * as actorApi from '../../api/actor.api';
import {mockIdentity, mockSatelliteId} from '../mocks/mocks';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlFactorySputnik} from '../../../declarations/sputnik/sputnik.factory.did.js';
import {getSatelliteExtendedActor} from '../../services/functions.services';

describe('satellite.services', () => {
  const satellite = {identity: mockIdentity, satelliteId: mockSatelliteId, container: true};

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns actor using getSatelliteExtendedActorApi', async () => {
    const mockActor = {mock: true} as any;
    vi.spyOn(actorApi, 'getSatelliteExtendedActor').mockResolvedValue(mockActor);

    const actor = await getSatelliteExtendedActor({
      idlFactory: idlFactorySputnik,
      satellite
    });

    expect(actor).toBe(mockActor);
    expect(actorApi.getSatelliteExtendedActor).toHaveBeenCalledOnce();
    expect(actorApi.getSatelliteExtendedActor).toHaveBeenCalledWith({
      idlFactory: idlFactorySputnik,
      ...satellite,
      identity: mockIdentity
    });
  });
});
