import {HttpAgent} from '@icp-sdk/core/agent';
import {nonNullish} from '@dfinity/utils';
import {DOCKER_CONTAINER_URL} from '../constants/container.constants';
import type {SatelliteContext} from '../types/satellite';

export type CreateAgentParams = Required<Pick<SatelliteContext, 'identity'>> &
  Pick<SatelliteContext, 'container'>;

export const createAgent = async ({identity, container}: CreateAgentParams): Promise<HttpAgent> => {
  const localActor = nonNullish(container) && container !== false;

  const host = localActor
    ? container === true
      ? DOCKER_CONTAINER_URL
      : container
    : 'https://icp-api.io';

  const shouldFetchRootKey = nonNullish(container);

  return await HttpAgent.create({
    identity,
    shouldFetchRootKey,
    host
  });
};
