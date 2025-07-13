import {satelliteIdlFactory, sputnikIdlFactory} from '../../api/_actor.factory';
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
      idlFactory: satelliteIdlFactory
    });

    expect(actor).toBe(cached);
  });

  it('creates an extended actor using getSatelliteExtendedActor', async () => {
    const actor = await getSatelliteExtendedActor({
      identity: mockIdentity,
      satelliteId: mockSatelliteId,
      container: false,
      idlFactory: satelliteIdlFactory
    });

    expect(actor).toBeDefined();

    const cached = await actorStore.getActor({
      identity: mockIdentity,
      satelliteId: mockSatelliteId,
      container: false,
      buildType: 'extended',
      idlFactory: sputnikIdlFactory
    });

    expect(actor).toBe(cached);
  });
});
