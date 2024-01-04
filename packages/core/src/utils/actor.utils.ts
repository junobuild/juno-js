import type {ActorMethod, ActorSubclass} from '@dfinity/agent';
import {Actor, HttpAgent} from '@dfinity/agent';
import type {IDL} from '@dfinity/candid';
import {nonNullish} from '@junobuild/utils';
import type {Satellite} from '../types/satellite.types';

export const createActor = async <T = Record<string, ActorMethod>>({
  satelliteId: canisterId,
  idlFactory,
  identity,
  fetch,
  container
}: {
  idlFactory: IDL.InterfaceFactory;
} & Required<Pick<Satellite, 'satelliteId' | 'identity'>> &
  Pick<Satellite, 'fetch' | 'container'>): Promise<ActorSubclass<T>> => {
  const host = nonNullish(container) ? container : 'https://icp-api.io';

  const agent: HttpAgent = new HttpAgent({identity, host, ...(fetch && {fetch})});

  if (nonNullish(container)) {
    // Fetch root key for certificate validation during development
    await agent.fetchRootKey();
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId
  });
};
