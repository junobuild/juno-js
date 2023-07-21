import type {ActorMethod, ActorSubclass} from '@dfinity/agent';
import {Actor, AnonymousIdentity, HttpAgent} from '@dfinity/agent';
import type {IDL} from '@dfinity/candid';
import {EnvironmentActor} from '../types/env';
import {nonNullish} from "@junobuild/utils";

export const createActor = async <T = Record<string, ActorMethod>>({
  satelliteId: canisterId,
  idlFactory,
  localOrbiterCanisterId
}: {
  idlFactory: IDL.InterfaceFactory;
} & EnvironmentActor): Promise<ActorSubclass<T>> => {
  const localActor = nonNullish(localOrbiterCanisterId);

  const host: string = localActor ? 'http://127.0.0.1:8000/' : 'https://icp0.io';

  const agent: HttpAgent = new HttpAgent({
    identity: new AnonymousIdentity(),
    ...(host && {host})
  });

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
