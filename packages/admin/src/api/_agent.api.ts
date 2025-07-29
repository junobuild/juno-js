import {HttpAgent} from '@dfinity/agent';
import {nonNullish} from '@dfinity/utils';
import type {ActorParameters} from '../types/actor';

export const useOrInitAgent = async ({agent, ...rest}: ActorParameters): Promise<HttpAgent> =>
  agent ?? (await initAgent(rest));

const initAgent = async ({
  identity,
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
    shouldFetchRootKey: localActor
  });
};
