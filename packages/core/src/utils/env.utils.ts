import {nonNullish} from '@junobuild/utils';
import {DOCKER_CONTAINER_URL} from '../constants/container.constants';
import {EnvStore} from '../stores/env.store';
import type {Satellite} from '../types/satellite.types';

export const satelliteUrl = ({
  satelliteId: customSatelliteId,
  container: customContainer
}: Satellite): string => {
  const {satelliteId} = customOrEnvSatelliteId({satelliteId: customSatelliteId});
  const {container} = customOrEnvContainer({container: customContainer});

  if (nonNullish(container) && container !== false) {
    const {host: containerHost, protocol} = new URL(
      container === true ? DOCKER_CONTAINER_URL : container
    );
    return `${protocol}//${satelliteId ?? 'unknown'}.${containerHost.replace('127.0.0.1', 'localhost')}`;
  }

  return `https://${satelliteId ?? 'unknown'}.icp0.io`;
};

export const customOrEnvSatelliteId = ({
  satelliteId
}: Pick<Satellite, 'satelliteId'>): Pick<Satellite, 'satelliteId'> =>
  nonNullish(satelliteId)
    ? {satelliteId}
    : EnvStore.getInstance().get() ?? {satelliteId: undefined};

export const customOrEnvContainer = ({
  container: customContainer
}: Pick<Satellite, 'container'>): Pick<Satellite, 'container'> =>
  nonNullish(customContainer)
    ? {container: customContainer}
    : EnvStore.getInstance().get() ?? {container: undefined};
