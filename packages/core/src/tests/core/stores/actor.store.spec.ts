import {AnonymousIdentity} from '@icp-sdk/core/agent';
import {idlFactorySatellite} from '@junobuild/ic-client/actor';
import {ActorStore} from '../../../core/stores/actor.store';
import {mockIdentity, mockSatelliteId} from '../../mocks/core.mock';

describe('actor.store', () => {
  let actorStore: ActorStore;

  beforeEach(() => {
    actorStore = ActorStore.getInstance();
    actorStore.reset();
  });

  it('creates a new actor if none exists in cache', async () => {
    const actor = await actorStore.getActor({
      identity: mockIdentity,
      satelliteId: mockSatelliteId,
      idlFactory: idlFactorySatellite,
      container: true,
      actorKey: 'stock#query'
    });

    expect(actor).toBeDefined();
    expect(typeof actor).toBe('object');
  });

  it('reuses cached actor on second call with same params', async () => {
    const params = {
      identity: mockIdentity,
      satelliteId: mockSatelliteId,
      idlFactory: idlFactorySatellite,
      container: true,
      actorKey: 'stock#query' as const
    };

    const actor1 = await actorStore.getActor(params);

    const actor2 = await actorStore.getActor(params);

    expect(actor1).toBe(actor2);
  });

  it('creates a new actor if actor key is stock or extended but same strategy is different', async () => {
    const common = {
      identity: mockIdentity,
      satelliteId: mockSatelliteId,
      idlFactory: idlFactorySatellite,
      container: true
    };

    const actor1 = await actorStore.getActor({
      ...common,
      actorKey: 'stock#query'
    });

    const actor2 = await actorStore.getActor({
      ...common,
      actorKey: 'extended#query'
    });

    expect(actor1).not.toBe(actor2);
  });

  it('creates a new actor if actor key is stock but strategy is different', async () => {
    const common = {
      identity: mockIdentity,
      satelliteId: mockSatelliteId,
      idlFactory: idlFactorySatellite,
      container: true
    };

    const actor1 = await actorStore.getActor({
      ...common,
      actorKey: 'stock#query'
    });

    const actor2 = await actorStore.getActor({
      ...common,
      actorKey: 'stock#update'
    });

    expect(actor1).not.toBe(actor2);
  });

  it('resets cached actors', async () => {
    const actor1 = await actorStore.getActor({
      identity: mockIdentity,
      satelliteId: mockSatelliteId,
      idlFactory: idlFactorySatellite,
      container: true,
      actorKey: 'stock#query'
    });

    actorStore.reset();

    const actor2 = await actorStore.getActor({
      identity: mockIdentity,
      satelliteId: mockSatelliteId,
      idlFactory: idlFactorySatellite,
      container: true,
      actorKey: 'stock#query'
    });

    expect(actor1).not.toBe(actor2);
  });

  it('creates a new actor if identity is different', async () => {
    const common = {
      satelliteId: mockSatelliteId,
      idlFactory: idlFactorySatellite,
      container: true,
      actorKey: 'stock#query' as const
    };

    const actor1 = await actorStore.getActor({
      identity: mockIdentity,
      ...common
    });

    const actor2 = await actorStore.getActor({
      identity: new AnonymousIdentity(),
      ...common
    });

    expect(actor1).not.toBe(actor2);
  });
});
