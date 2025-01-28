import {
  Actor,
  AnonymousIdentity,
  HttpAgent,
  type ActorMethod,
  type ActorSubclass
} from '@dfinity/agent';
import type {IDL} from '@dfinity/candid';
import {nonNullish} from '@dfinity/utils';
import type {EnvironmentActor} from '../types/env';

export const createActor = async <T = Record<string, ActorMethod>>({
  orbiterId: canisterId,
  idlFactory,
  container
}: {
  idlFactory: IDL.InterfaceFactory;
} & EnvironmentActor): Promise<ActorSubclass<T>> => {
  const localActor = nonNullish(container) && container !== false;

  const host = localActor
    ? container === true
      ? 'http://127.0.0.1:5987'
      : container
    : 'https://icp-api.io';

  const agent: HttpAgent = await HttpAgent.create({
    identity: new AnonymousIdentity(),
    host,
    shouldFetchRootKey: localActor
  });

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId
  });
};
