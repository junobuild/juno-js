import type {MockInstance} from 'vitest';
import * as agentFactory from '../../stores/_agent.factory';
import {AgentStore} from '../../stores/agent.store';
import {mockIdentity} from '../mocks/mocks';

describe('agent.store', () => {
  let agentStore: AgentStore;
  let spyAgentFactory: MockInstance;

  beforeEach(() => {
    vi.restoreAllMocks();

    agentStore = AgentStore.getInstance();
    agentStore.reset();

    spyAgentFactory = vi.spyOn(agentFactory, 'createAgent');
  });

  describe('Cache and create', () => {
    it('creates a new agent if none exists in cache', async () => {
      const agent = await agentStore.getAgent({
        identity: mockIdentity,
        container: true
      });

      expect(agent).toBeDefined();
      expect(spyAgentFactory).toHaveBeenCalledOnce();
      expect(spyAgentFactory).toHaveBeenCalledWith({
        identity: mockIdentity,
        container: true
      });
    });

    it('reuses cached agent on second call', async () => {
      const first = await agentStore.getAgent({
        identity: mockIdentity,
        container: true
      });

      const second = await agentStore.getAgent({
        identity: mockIdentity,
        container: true
      });

      expect(first).toBe(second);
      expect(spyAgentFactory).toHaveBeenCalledTimes(1);
    });

    it('resets cached agents', async () => {
      await agentStore.getAgent({
        identity: mockIdentity,
        container: true
      });

      agentStore.reset();

      const _third = await agentStore.getAgent({
        identity: mockIdentity,
        container: true
      });

      expect(spyAgentFactory).toHaveBeenCalledTimes(2);
    });
  });

  describe('Option container', () => {
    it('passes container as true', async () => {
      await agentStore.getAgent({
        identity: mockIdentity,
        container: true
      });

      expect(spyAgentFactory).toHaveBeenCalledWith({
        identity: mockIdentity,
        container: true
      });
    });

    it('passes container as a custom URL', async () => {
      await agentStore.getAgent({
        identity: mockIdentity,
        container: 'http://custom-container-url:4943'
      });

      expect(spyAgentFactory).toHaveBeenCalledWith({
        identity: mockIdentity,
        container: 'http://custom-container-url:4943'
      });
    });

    it('passes container as false', async () => {
      await agentStore.getAgent({
        identity: mockIdentity,
        container: false
      });

      expect(spyAgentFactory).toHaveBeenCalledWith({
        identity: mockIdentity,
        container: false
      });
    });

    it('passes container as undefined', async () => {
      await agentStore.getAgent({
        identity: mockIdentity
        // container omitted on purpose
      });

      expect(spyAgentFactory).toHaveBeenCalledWith({
        identity: mockIdentity,
        container: undefined
      });
    });
  });
});
