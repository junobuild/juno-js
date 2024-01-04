import {nonNullish} from '@junobuild/utils';
import {EnvStore} from '../stores/env.store';

export const satelliteUrl = (): string => {
  const satelliteId = EnvStore.getInstance().get()?.satelliteId ?? 'unknown';

  const container = EnvStore.getInstance().get()?.container;

  if (nonNullish(container)) {
    const {host: containerHost, protocol} = new URL(container);
    return `${protocol}://${satelliteId}.${containerHost}`;
  }

  return `https://${satelliteId}.icp0.io`;
};
