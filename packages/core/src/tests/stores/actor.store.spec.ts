import {beforeEach, describe, expect, it} from 'vitest';
import {ActorStore} from '../../stores/actor.store';
import {mockIdentity, mockSatelliteId} from '../mocks/mocks';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as stockIdlFactory} from '../../../declarations/satellite/satellite.factory.did.js';

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
      idlFactory: stockIdlFactory,
      container: true,
      buildType: 'stock'
    });

    expect(actor).toBeDefined();
    expect(typeof actor).toBe('object');
  });

  it('reuses cached actor on second call with same params', async () => {
    const actor1 = await actorStore.getActor({
      identity: mockIdentity,
      satelliteId: mockSatelliteId,
      idlFactory: stockIdlFactory,
      container: true,
      buildType: 'stock'
    });

    const actor2 = await actorStore.getActor({
      identity: mockIdentity,
      satelliteId: mockSatelliteId,
      idlFactory: stockIdlFactory,
      container: true,
      buildType: 'stock'
    });

    expect(actor1).toBe(actor2);
  });

  it('creates a new actor if buildType is different', async () => {
    const actor1 = await actorStore.getActor({
      identity: mockIdentity,
      satelliteId: mockSatelliteId,
      idlFactory: stockIdlFactory,
      container: true,
      buildType: 'stock'
    });

    const actor2 = await actorStore.getActor({
      identity: mockIdentity,
      satelliteId: mockSatelliteId,
      idlFactory: stockIdlFactory,
      container: true,
      buildType: 'extended'
    });

    expect(actor1).not.toBe(actor2);
  });

  it('resets cached actors', async () => {
    const actor1 = await actorStore.getActor({
      identity: mockIdentity,
      satelliteId: mockSatelliteId,
      idlFactory: stockIdlFactory,
      container: true,
      buildType: 'stock'
    });

    actorStore.reset();

    const actor2 = await actorStore.getActor({
      identity: mockIdentity,
      satelliteId: mockSatelliteId,
      idlFactory: stockIdlFactory,
      container: true,
      buildType: 'stock'
    });

    expect(actor1).not.toBe(actor2);
  });
});
