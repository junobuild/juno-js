import {idlFactorySatellite, idlFactorySputnik} from '@junobuild/ic-client/actor';
import {getSatelliteActor, getSatelliteExtendedActor} from '../../api/actor.api';
import {ActorStore} from '../../stores/actor.store';
import {mockIdentity, mockSatelliteId} from '../mocks/core.mock';

describe('actor.api', () => {
  let actorStore: ActorStore;

  beforeEach(() => {
    actorStore = ActorStore.getInstance();
    actorStore.reset();
  });

  describe('stock actors', () => {
    it('creates a stock actor with certified read strategy', async () => {
      const actor = await getSatelliteActor({
        satellite: {identity: mockIdentity, satelliteId: mockSatelliteId, container: true},
        options: {certified: true}
      });

      expect(actor).toBeDefined();

      const cached = await actorStore.getActor({
        identity: mockIdentity,
        satelliteId: mockSatelliteId,
        container: true,
        actorKey: 'stock#update', // certified = true → reads as update
        idlFactory: idlFactorySatellite
      });

      expect(actor).toBe(cached);
    });

    it('creates a stock actor with uncertified read strategy', async () => {
      const actor = await getSatelliteActor({
        satellite: {identity: mockIdentity, satelliteId: mockSatelliteId, container: true},
        options: {certified: false}
      });

      expect(actor).toBeDefined();

      const cached = await actorStore.getActor({
        identity: mockIdentity,
        satelliteId: mockSatelliteId,
        container: true,
        actorKey: 'stock#query', // certified = false → reads as query
        idlFactory: idlFactorySatellite
      });

      expect(actor).toBe(cached);
    });

    it('creates different actors when certified', async () => {
      const actor = await getSatelliteActor({
        satellite: {identity: mockIdentity, satelliteId: mockSatelliteId, container: true},
        options: {certified: true}
      });

      const cached = await actorStore.getActor({
        identity: mockIdentity,
        satelliteId: mockSatelliteId,
        container: true,
        actorKey: 'stock#query',
        idlFactory: idlFactorySatellite
      });

      expect(actor).not.toBe(cached);
    });

    it('creates different actors when uncertified', async () => {
      const actor = await getSatelliteActor({
        satellite: {identity: mockIdentity, satelliteId: mockSatelliteId, container: true},
        options: {certified: false}
      });

      const cached = await actorStore.getActor({
        identity: mockIdentity,
        satelliteId: mockSatelliteId,
        container: true,
        actorKey: 'stock#update',
        idlFactory: idlFactorySatellite
      });

      expect(actor).not.toBe(cached);
    });
  });

  describe('extended actors', () => {
    it('creates an extended actor using getSatelliteExtendedActor', async () => {
      const actor = await getSatelliteExtendedActor({
        identity: mockIdentity,
        satelliteId: mockSatelliteId,
        container: false,
        idlFactory: idlFactorySatellite
      });

      expect(actor).toBeDefined();

      const cached = await actorStore.getActor({
        identity: mockIdentity,
        satelliteId: mockSatelliteId,
        container: false,
        actorKey: 'extended#query',
        idlFactory: idlFactorySputnik
      });

      expect(actor).toBe(cached);
    });
  });
});
