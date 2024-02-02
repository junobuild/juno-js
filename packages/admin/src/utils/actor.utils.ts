import type {ActorConfig, ActorMethod, ActorSubclass} from '@dfinity/agent';
import {Actor, HttpAgent} from '@dfinity/agent';
import type {IDL} from '@dfinity/candid';
import {nonNullish} from '@junobuild/utils';
import type {ActorParameters} from '../types/actor.types';

export const createActor = async <T = Record<string, ActorMethod>>({
  canisterId,
  idlFactory,
  config,
  ...rest
}: {
  idlFactory: IDL.InterfaceFactory;
  canisterId: string;
  config?: Pick<ActorConfig, 'callTransform' | 'queryTransform'>;
} & ActorParameters): Promise<ActorSubclass<T>> => {
  const agent = await initAgent(rest);

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...(config !== undefined ? config : {})
  });
};

export const initAgent = async ({
  identity,
  fetch,
  container
}: ActorParameters): Promise<HttpAgent> => {
  const localActor = nonNullish(container) && container !== false;

  const host = localActor
    ? container === true
      ? 'http://127.0.0.1:5987'
      : container
    : 'https://icp-api.io';

  const agent = new HttpAgent({identity, host, ...(fetch && {fetch})});

  if (localActor) {
    // Fetch root key for certificate validation during development
    await agent.fetchRootKey();
  }

  return agent;
};
