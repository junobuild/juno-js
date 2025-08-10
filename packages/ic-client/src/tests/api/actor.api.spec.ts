import type {ActorSubclass} from '@dfinity/agent';
import {MockInstance} from 'vitest';
import * as actorApi from '../../api/actor.api';
import * as agentFactory from '../../api/agent.api';
import {mockIdentity} from '../mocks/ic-agent.mock';
import {mockSatelliteIdText} from '../mocks/modules.mock';

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
        satelliteId: mockSatelliteIdText,
        certified: true,
        identity: mockIdentity
      });

      expect(actor).toBeDefined();
      expect(spyUseOrInitAgent).toHaveBeenCalledOnce();
    });

    it('creates a non-certified satellite actor', async () => {
      const actor = await actorApi.getSatelliteActor({
        satelliteId: mockSatelliteIdText,
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
        missionControlId: mockSatelliteIdText,
        identity: mockIdentity
      });

      expect(actor).toBeDefined();
      expect(spyUseOrInitAgent).toHaveBeenCalledOnce();
    });
  });

  describe('getOrbiterActor', () => {
    it('creates a certified orbiter actor', async () => {
      const actor = await actorApi.getOrbiterActor({
        orbiterId: mockSatelliteIdText,
        certified: true,
        identity: mockIdentity
      });

      expect(actor).toBeDefined();
      expect(spyUseOrInitAgent).toHaveBeenCalledOnce();
    });

    it('creates a non-certified orbiter actor', async () => {
      const actor = await actorApi.getOrbiterActor({
        orbiterId: mockSatelliteIdText,
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
        satelliteId: mockSatelliteIdText,
        identity: mockIdentity
      });

      expect(actor).toBeDefined();
      expect(spyUseOrInitAgent).toHaveBeenCalledOnce();
    });
  });

  describe('getDeprecatedSatelliteNoScopeActor', () => {
    it('creates a deprecated satellite no scope actor', async () => {
      const actor = await actorApi.getDeprecatedSatelliteNoScopeActor({
        satelliteId: mockSatelliteIdText,
        identity: mockIdentity
      });

      expect(actor).toBeDefined();
      expect(spyUseOrInitAgent).toHaveBeenCalledOnce();
    });
  });

  describe('getDeprecatedSatelliteVersionActor', () => {
    it('creates a deprecated satellite version actor', async () => {
      const actor = await actorApi.getDeprecatedSatelliteVersionActor({
        satelliteId: mockSatelliteIdText,
        identity: mockIdentity
      });

      expect(actor).toBeDefined();
      expect(spyUseOrInitAgent).toHaveBeenCalledOnce();
    });
  });

  describe('getDeprecatedMissionControlVersionActor', () => {
    it('creates a deprecated mission control version actor', async () => {
      const actor = await actorApi.getDeprecatedMissionControlVersionActor({
        missionControlId: mockSatelliteIdText,
        identity: mockIdentity
      });

      expect(actor).toBeDefined();
      expect(spyUseOrInitAgent).toHaveBeenCalledOnce();
    });
  });

  describe('getDeprecatedOrbiterVersionActor', () => {
    it('creates a deprecated orbiter version actor', async () => {
      const actor = await actorApi.getDeprecatedOrbiterVersionActor({
        orbiterId: mockSatelliteIdText,
        identity: mockIdentity
      });

      expect(actor).toBeDefined();
      expect(spyUseOrInitAgent).toHaveBeenCalledOnce();
    });
  });
});
