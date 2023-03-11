import {EnvStore} from '../stores/env.store';

export const isBrowser = () => typeof window !== `undefined`;

export const satelliteUrl = (): string => {
  const satelliteId: string = EnvStore.getInstance().get()?.satelliteId ?? 'unknown';

  if (EnvStore.getInstance().localIdentity()) {
    return `http://${satelliteId}.localhost:8000`;
  }

  return `https://${satelliteId}.icp0.io`;
};
