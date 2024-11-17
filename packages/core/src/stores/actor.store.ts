import {Actor, type ActorSubclass} from '@dfinity/agent';
import type {ActorMethod} from '@dfinity/agent/lib/esm/actor';
import type {IDL} from '@dfinity/candid';
import {isNullish} from '@junobuild/utils';
import type {BuildType} from '../types/build.types';
import type {Satellite} from '../types/satellite.types';
import {AgentStore} from './agent.store';

type ActorParams = {
  idlFactory: IDL.InterfaceFactory;
} & Required<Pick<Satellite, 'satelliteId' | 'identity'>> &
  Pick<Satellite, 'fetch' | 'container'>;

type ActorRecord = Record<string, ActorMethod>;

export class ActorStore {
  private static instance: ActorStore;

  #actors: Option<Record> = undefined;

  private constructor() {}

  static getInstance() {
    if (isNullish(ActorStore.instance)) {
      ActorStore.instance = new ActorStore();
    }
    return ActorStore.instance;
  }

  async getActor<T = ActorRecord>({
    satelliteId,
    identity,
    buildType,
    ...rest
  }: ActorParams & {buildType: BuildType}): Promise<ActorSubclass<T>> {
    const key = `${buildType}#${identity.getPrincipal().toText()}#${satelliteId};`;

    if (isNullish(this.#actors) || isNullish(this.#actors[key])) {
      const actor = await this.createActor({satelliteId, identity, ...rest});

      this.#actors = {
        ...(this.#actors ?? {}),
        [key]: actor
      };

      return actor as ActorSubclass<T>;
    }

    return this.#actors[key] as ActorSubclass<T>;
  }

  reset() {
    this.#actors = null;
  }

  private async createActor<T = ActorRecord>({
    idlFactory,
    satelliteId: canisterId,
    ...rest
  }: ActorParams): Promise<ActorSubclass<T>> {
    const agent = await AgentStore.getInstance().getAgent(rest);

    return Actor.createActor(idlFactory, {
      agent,
      canisterId
    });
  }
}
