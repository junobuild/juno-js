import type {Agent, HttpAgent} from '@dfinity/agent';
import {isNullish} from '@dfinity/utils';
import {type CreateAgentParams, createAgent} from './_agent.factory';

export class AgentStore {
  private static instance: AgentStore;

  #agents: Record<string, HttpAgent> | undefined | null = undefined;

  private constructor() {}

  static getInstance() {
    if (isNullish(AgentStore.instance)) {
      AgentStore.instance = new AgentStore();
    }
    return AgentStore.instance;
  }

  async getAgent({identity, ...rest}: CreateAgentParams): Promise<Agent> {
    const key = identity.getPrincipal().toText();

    if (isNullish(this.#agents) || isNullish(this.#agents[key])) {
      const agent = await createAgent({identity, ...rest});

      this.#agents = {
        ...(this.#agents ?? {}),
        [key]: agent
      };

      return agent;
    }

    return this.#agents[key];
  }

  reset() {
    this.#agents = null;
  }
}
