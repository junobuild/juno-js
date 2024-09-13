import {Actor, type ActorSubclass} from '@dfinity/agent';
import type {ActorMethod} from '@dfinity/agent/lib/esm/actor';
import type {IDL} from '@dfinity/candid';
import {isNullish} from '@junobuild/utils';
import type {Satellite} from '../types/satellite.types';
import {AgentStore} from './agent.store';

type ActorParams = {
  idlFactory: IDL.InterfaceFactory;
} & Required<Pick<Satellite, 'satelliteId' | 'identity'>> &
  Pick<Satellite, 'fetch' | 'container'>;

type ActorRecord = Record<string, ActorMethod>;

export class ActorStore {
  #actors: Record<string, ActorSubclass<ActorRecord>> | undefined = undefined;

  #agentStore = new AgentStore();

  async getActor<T = ActorRecord>({
    satelliteId: key,
    ...rest
  }: ActorParams): Promise<ActorSubclass<T>> {
    if (isNullish(this.#actors) || isNullish(this.#actors[key])) {
      const actor = await this.createActor({satelliteId: key, ...rest});

      this.#actors = {
        ...(this.#actors ?? {}),
        [key]: actor
      };

      return actor as ActorSubclass<T>;
    }

    return this.#actors[key] as ActorSubclass<T>;
  }

  private async createActor<T = ActorRecord>({
    idlFactory,
    satelliteId: canisterId,
    ...rest
  }: ActorParams): Promise<ActorSubclass<T>> {
    const agent = await this.#agentStore.getAgent(rest);

    return Actor.createActor(idlFactory, {
      agent,
      canisterId
    });
  }
}
