import {assertNonNullish} from '@junobuild/utils';
import {initAuthTimeoutWorker} from './services/auth-timout.services';
import {initAuth} from './services/auth.services';
import {AuthStore} from './stores/auth.store';
import {EnvStore} from './stores/env.store';
import type {User} from './types/auth.types';
import type {Environment, UserEnvironment} from './types/env.types';
import type {Unsubscribe} from './types/subscription.types';
import {envContainer, envSatelliteId} from './utils/window.env.utils';

export * from './providers/auth.providers';
export {signIn, signOut, unsafeIdentity} from './services/auth.services';
export * from './services/doc.services';
export * from './services/storage.services';
export * from './types/auth.types';
export * from './types/doc.types';
export * from './types/env.types';
export {ListOrder, ListPaginate, ListParams, ListResults} from './types/list.types';
export * from './types/satellite.types';
export * from './types/storage.types';
export * from './types/subscription.types';

const parseEnv = (userEnv?: UserEnvironment): Environment => {
  const satelliteId = userEnv?.satelliteId ?? envSatelliteId();

  assertNonNullish(satelliteId, 'Satellite ID is not configured. Juno cannot be initialized.');

  const container = userEnv?.container ?? envContainer();

  return {
    satelliteId,
    internetIdentityId: userEnv?.internetIdentityId,
    workers: userEnv?.workers,
    container
  };
};

export const initJuno = async (userEnv?: UserEnvironment): Promise<Unsubscribe[]> => {
  const env = parseEnv(userEnv);

  EnvStore.getInstance().set(env);

  await initAuth();

  const authSubscribe =
    env.workers?.auth !== undefined ? initAuthTimeoutWorker(env.workers.auth) : undefined;

  return [...(authSubscribe ? [authSubscribe] : [])];
};

export const authSubscribe = (callback: (authUser: User | null) => void): Unsubscribe =>
  AuthStore.getInstance().subscribe(callback);
