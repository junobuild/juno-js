import type {ActorConfig, ActorMethod, ActorSubclass} from '@dfinity/agent';
import {Actor, HttpAgent} from '@dfinity/agent';
import type {IDL} from '@dfinity/candid';
import {nonNullish} from '@dfinity/utils';
import type {ActorParameters} from '../types/actor.types';

export const createActor = async <T = Record<string, ActorMethod>>({
  canisterId,
  idlFactory,
  identity,
  fetch,
  container,
  config
}: {
  idlFactory: IDL.InterfaceFactory;
  canisterId: string;
  config?: Pick<ActorConfig, 'callTransform' | 'queryTransform'>;
} & ActorParameters): Promise<ActorSubclass<T>> => {
  const localActor = nonNullish(container) && container !== false;

  const host = localActor
    ? container === true
      ? 'http://127.0.0.1:5987'
      : container
    : 'https://icp-api.io';

  const agent: HttpAgent = await HttpAgent.create({
    identity,
    host,
    shouldFetchRootKey: localActor,
    ...(fetch && {fetch})
  });

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...(config !== undefined ? config : {})
  });
};
