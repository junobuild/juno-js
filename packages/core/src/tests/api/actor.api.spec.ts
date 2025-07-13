// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as stockIdlFactory} from '../../../declarations/satellite/satellite.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlFactorySputnik} from '../../../declarations/sputnik/sputnik.factory.did.js';
import {getSatelliteActor, getSatelliteExtendedActor} from '../../api/actor.api';
import {ActorStore} from '../../stores/actor.store';
import {mockIdentity, mockSatelliteId} from '../mocks/mocks';

describe('actor.api', () => {
  let actorStore: ActorStore;

  beforeEach(() => {
    actorStore = ActorStore.getInstance();
    actorStore.reset();
  });

  it('creates a stock actor using getSatelliteActor', async () => {
    const actor = await getSatelliteActor({
      identity: mockIdentity,
      satelliteId: mockSatelliteId,
      container: true
    });

    expect(actor).toBeDefined();

    const cached = await actorStore.getActor({
      identity: mockIdentity,
      satelliteId: mockSatelliteId,
      container: true,
      buildType: 'stock',
      idlFactory: stockIdlFactory
    });

    expect(actor).toBe(cached);
  });

  it('creates an extended actor using getSatelliteExtendedActor', async () => {
    const actor = await getSatelliteExtendedActor({
      identity: mockIdentity,
      satelliteId: mockSatelliteId,
      container: false,
      idlFactory: stockIdlFactory
    });

    expect(actor).toBeDefined();

    const cached = await actorStore.getActor({
      identity: mockIdentity,
      satelliteId: mockSatelliteId,
      container: false,
      buildType: 'extended',
      idlFactory: idlFactorySputnik
    });

    expect(actor).toBe(cached);
  });
});
