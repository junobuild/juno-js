import type {ActorSubclass} from '@dfinity/agent';
import {MockInstance} from 'vitest';
import * as actorApi from '../../api/_actor.api';
import * as agentFactory from '../../api/_agent.api';
import {mockIdentity, mockSatelliteId} from '../mocks/mocks';

vi.mock('../../api/_agent.api', () => ({
  useOrInitAgent: vi.fn().mockResolvedValue({} as unknown as ActorSubclass)
}));

describe('_actor.api', () => {
  let spyUseOrInitAgent: MockInstance;

  beforeEach(() => {
    vi.restoreAllMocks();

    spyUseOrInitAgent = vi.spyOn(agentFactory, 'useOrInitAgent');
  });

  describe('getSatelliteActor', () => {
    it('creates a certified satellite actor', async () => {
      const actor = await actorApi.getSatelliteActor({
        satelliteId: mockSatelliteId,
        certified: true,
        identity: mockIdentity
      });

      expect(actor).toBeDefined();
      expect(spyUseOrInitAgent).toHaveBeenCalledOnce();
    });

    it('creates a non-certified satellite actor', async () => {
      const actor = await actorApi.getSatelliteActor({
        satelliteId: mockSatelliteId,
        certified: false,
        identity: mockIdentity
      });

      expect(actor).toBeDefined();
      expect(spyUseOrInitAgent).toHaveBeenCalledOnce();
    });
  });

  describe('getMissionControlActor', () => {
    it('creates a mission control actor', async () => {
      const actor = await actorApi.getMissionControlActor({
        missionControlId: mockSatelliteId,
        identity: mockIdentity
      });

      expect(actor).toBeDefined();
      expect(spyUseOrInitAgent).toHaveBeenCalledOnce();
    });
  });

  describe('getOrbiterActor', () => {
    it('creates a certified orbiter actor', async () => {
      const actor = await actorApi.getOrbiterActor({
        orbiterId: mockSatelliteId,
        certified: true,
        identity: mockIdentity
      });

      expect(actor).toBeDefined();
      expect(spyUseOrInitAgent).toHaveBeenCalledOnce();
    });

    it('creates a non-certified orbiter actor', async () => {
      const actor = await actorApi.getOrbiterActor({
        orbiterId: mockSatelliteId,
        certified: false,
        identity: mockIdentity
      });

      expect(actor).toBeDefined();
      expect(spyUseOrInitAgent).toHaveBeenCalledOnce();
    });
  });

  describe('getDeprecatedSatelliteActor', () => {
    it('creates a deprecated satellite actor', async () => {
      const actor = await actorApi.getDeprecatedSatelliteActor({
        satelliteId: mockSatelliteId,
        identity: mockIdentity
      });

      expect(actor).toBeDefined();
      expect(spyUseOrInitAgent).toHaveBeenCalledOnce();
    });
  });

  describe('getDeprecatedSatelliteNoScopeActor', () => {
    it('creates a deprecated satellite no scope actor', async () => {
      const actor = await actorApi.getDeprecatedSatelliteNoScopeActor({
        satelliteId: mockSatelliteId,
        identity: mockIdentity
      });

      expect(actor).toBeDefined();
      expect(spyUseOrInitAgent).toHaveBeenCalledOnce();
    });
  });

  describe('getDeprecatedSatelliteVersionActor', () => {
    it('creates a deprecated satellite version actor', async () => {
      const actor = await actorApi.getDeprecatedSatelliteVersionActor({
        satelliteId: mockSatelliteId,
        identity: mockIdentity
      });

      expect(actor).toBeDefined();
      expect(spyUseOrInitAgent).toHaveBeenCalledOnce();
    });
  });

  describe('getDeprecatedMissionControlVersionActor', () => {
    it('creates a deprecated mission control version actor', async () => {
      const actor = await actorApi.getDeprecatedMissionControlVersionActor({
        missionControlId: mockSatelliteId,
        identity: mockIdentity
      });

      expect(actor).toBeDefined();
      expect(spyUseOrInitAgent).toHaveBeenCalledOnce();
    });
  });

  describe('getDeprecatedOrbiterVersionActor', () => {
    it('creates a deprecated orbiter version actor', async () => {
      const actor = await actorApi.getDeprecatedOrbiterVersionActor({
        orbiterId: mockSatelliteId,
        identity: mockIdentity
      });

      expect(actor).toBeDefined();
      expect(spyUseOrInitAgent).toHaveBeenCalledOnce();
    });
  });
});
