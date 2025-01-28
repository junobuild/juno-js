import {
  Actor,
  HttpAgent,
  type ActorConfig,
  type ActorMethod,
  type ActorSubclass
} from '@dfinity/agent';
import type {IDL} from '@dfinity/candid';
import {nonNullish} from '@dfinity/utils';
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
  const agent = await useOrInitAgent(rest);

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...(config ?? {})
  });
};

export const useOrInitAgent = async ({agent, ...rest}: ActorParameters): Promise<HttpAgent> =>
  agent ?? (await initAgent(rest));

const initAgent = async ({
  identity,
  fetch,
  container
}: Omit<ActorParameters, 'agent'>): Promise<HttpAgent> => {
  const localActor = nonNullish(container) && container !== false;

  const host = localActor
    ? container === true
      ? 'http://127.0.0.1:5987'
      : container
    : 'https://icp-api.io';

  return await HttpAgent.create({
    identity,
    host,
    retryTimes: 10,
    ...(nonNullish(fetch) && {fetch}),
    shouldFetchRootKey: localActor
  });
};
