import {nonNullish} from '@dfinity/utils';
import {DOCKER_CONTAINER_URL} from '../constants/container.constants';
import {EnvStore} from '../stores/env.store';
import type {SatelliteContext} from '../types/satellite';

export const satelliteUrl = ({
  satelliteId: customSatelliteId,
  container: customContainer
}: SatelliteContext): string => {
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
}: Pick<SatelliteContext, 'satelliteId'>): Pick<SatelliteContext, 'satelliteId'> =>
  nonNullish(satelliteId)
    ? {satelliteId}
    : (EnvStore.getInstance().get() ?? {satelliteId: undefined});

export const customOrEnvContainer = ({
  container: customContainer
}: Pick<SatelliteContext, 'container'>): Pick<SatelliteContext, 'container'> =>
  nonNullish(customContainer)
    ? {container: customContainer}
    : (EnvStore.getInstance().get() ?? {container: undefined});
