import {HttpAgent, type Agent} from '@dfinity/agent';
import {isNullish, nonNullish} from '@junobuild/utils';
import {DOCKER_CONTAINER_URL} from '../constants/container.constants';
import type {Satellite} from '../types/satellite.types';

type AgentParams = Required<Pick<Satellite, 'identity'>> & Pick<Satellite, 'fetch' | 'container'>;

export class AgentStore {
  #agents: Record<string, HttpAgent> | undefined = undefined;

  async getAgent({identity, ...rest}: AgentParams): Promise<Agent> {
    const key = identity.getPrincipal().toText();

    if (isNullish(this.#agents) || isNullish(this.#agents[key])) {
      const agent = await this.createAgent({identity, ...rest});

      this.#agents = {
        ...(this.#agents ?? {}),
        [key]: agent
      };

      return agent;
    }

    return this.#agents[key];
  }

  private async createAgent({identity, fetch, container}: AgentParams): Promise<HttpAgent> {
    const localActor = nonNullish(container) && container !== false;

    const host = localActor
      ? container === true
        ? DOCKER_CONTAINER_URL
        : container
      : 'https://icp-api.io';

    const shouldFetchRootKey = nonNullish(container);

    return await HttpAgent.create({
      identity,
      shouldFetchRootKey,
      host,
      ...(fetch && {fetch})
    });
  }
}
