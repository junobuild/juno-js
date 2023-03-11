import type {ActorMethod, ActorSubclass} from '@dfinity/agent';
import {Actor, HttpAgent} from '@dfinity/agent';
import type {IDL} from '@dfinity/candid';
import {EnvStore} from '../stores/env.store';
import type {Satellite} from '../types/satellite.types';

export const createActor = async <T = Record<string, ActorMethod>>({
  satelliteId: canisterId,
  idlFactory,
  identity,
  fetch,
  env = 'prod'
}: {
  idlFactory: IDL.InterfaceFactory;
} & Required<Pick<Satellite, 'satelliteId' | 'identity'>> &
  Pick<Satellite, 'fetch' | 'env'>): Promise<ActorSubclass<T>> => {
  const localActor = env === 'dev' || EnvStore.getInstance().localIdentity();

  const host: string = localActor ? 'http://127.0.0.1:8000/' : 'https://icp0.io';

  const agent: HttpAgent = new HttpAgent({identity, ...(host && {host}), ...(fetch && {fetch})});

  if (localActor) {
    // Fetch root key for certificate validation during development
    await agent.fetchRootKey();
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId
  });
};
