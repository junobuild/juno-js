import type {HttpAgent} from '@dfinity/agent';
import type {MockInstance} from 'vitest';
import {useOrInitAgent} from '../../api/agent.api';
import * as agent from '../../utils/agent.utils';
import {mockIdentity} from '../mocks/ic-agent.mock';

describe('_agent.api', () => {
  let spyCreateAgent: MockInstance;

  beforeEach(() => {
    vi.restoreAllMocks();

    spyCreateAgent = vi.spyOn(agent, 'createAgent').mockResolvedValue({
      fetchRootKey: vi.fn(),
      getPrincipal: vi.fn()
    } as unknown as HttpAgent);
  });

  describe('useOrInitAgent', () => {
    it('returns existing agent if provided', async () => {
      const existingAgent = {} as HttpAgent;
      const agentInstance = await useOrInitAgent({
        agent: existingAgent,
        identity: mockIdentity
      });

      expect(agentInstance).toBe(existingAgent);
    });

    it('initializes a new agent if none is provided', async () => {
      const agentInstance = await useOrInitAgent({identity: mockIdentity});

      expect(agentInstance).toBeDefined();
      expect(spyCreateAgent).toHaveBeenCalledOnce();
      expect(spyCreateAgent).toHaveBeenCalledWith({
        identity: mockIdentity,
        host: 'https://icp-api.io',
        localActor: false
      });
    });

    it('initializes a new agent with local container', async () => {
      const agentInstance = await useOrInitAgent({identity: mockIdentity, container: true});

      expect(agentInstance).toBeDefined();
      expect(spyCreateAgent).toHaveBeenCalledOnce();
      expect(spyCreateAgent).toHaveBeenCalledWith({
        identity: mockIdentity,
        host: 'http://127.0.0.1:5987',
        localActor: true
      });
    });
  });
});
