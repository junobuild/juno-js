import type {ActorSubclass} from '@dfinity/agent';
import {Actor, HttpAgent} from '@dfinity/agent';
import type {ActorMethod} from '@dfinity/agent/lib/esm/actor';
import type {IDL} from '@dfinity/candid';
import {nonNullish} from '@junobuild/utils';
import {DOCKER_CONTAINER_URL} from '../constants/container.constants';
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
  const localActor = nonNullish(container) && container !== false;

  const host = localActor
    ? container === true
      ? DOCKER_CONTAINER_URL
      : container
    : 'https://icp-api.io';

  const shouldFetchRootKey = nonNullish(container);

  const agent: HttpAgent = await HttpAgent.create({
    identity,
    shouldFetchRootKey,
    host,
    ...(fetch && {fetch})
  });

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId
  });
};
