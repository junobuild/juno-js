import type {ActorConfig, ActorMethod, ActorSubclass} from '@dfinity/agent';
import {Actor, HttpAgent} from '@dfinity/agent';
import type {IDL} from '@dfinity/candid';
import type {ActorParameters} from '../types/actor.types';

export const createActor = async <T = Record<string, ActorMethod>>({
  canisterId,
  idlFactory,
  identity,
  fetch,
  env = 'prod',
  config
}: {
  idlFactory: IDL.InterfaceFactory;
  canisterId: string;
  config?: Pick<ActorConfig, 'callTransform' | 'queryTransform'>;
} & ActorParameters): Promise<ActorSubclass<T>> => {
  const host: string = env === 'dev' ? 'http://127.0.0.1:8000/' : 'https://ic0.app';

  const agent: HttpAgent = new HttpAgent({identity, ...(host && {host}), ...(fetch && {fetch})});

  if (env === 'dev') {
    // Fetch root key for certificate validation during development
    await agent.fetchRootKey();
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...(config !== undefined ? config : {})
  });
};
