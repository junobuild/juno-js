import {HttpAgent} from '@dfinity/agent';
import {nonNullish} from '@dfinity/utils';
import {DOCKER_CONTAINER_URL} from '../constants/container.constants';
import type {Satellite} from '../types/satellite.types';

export type CreateAgentParams = Required<Pick<Satellite, 'identity'>> &
  Pick<Satellite, 'container'>;

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
