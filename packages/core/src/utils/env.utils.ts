import {nonNullish} from '@junobuild/utils';
import {DOCKER_CONTAINER_URL} from '../constants/container.constants';
import {EnvStore} from '../stores/env.store';

export const satelliteUrl = (): string => {
  const satelliteId = EnvStore.getInstance().get()?.satelliteId ?? 'unknown';

  const container = EnvStore.getInstance().get()?.container;

  if (nonNullish(container) && container !== false) {
    const {host: containerHost, protocol} = new URL(
      container === true ? DOCKER_CONTAINER_URL : container
    );
    return `${protocol}://${satelliteId}.${containerHost}`;
  }

  return `https://${satelliteId}.icp0.io`;
};
