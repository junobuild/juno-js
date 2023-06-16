import {initAuthTimeoutWorker} from './services/auth-timout.services';
import {initAuth} from './services/auth.services';
import {AuthStore} from './stores/auth.store';
import {EnvStore} from './stores/env.store';
import type {User} from './types/auth.types';
import type {Environment} from './types/env.types';
import type {Unsubscribe} from './types/subscription.types';

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

export const initJuno = async (env: Environment): Promise<Unsubscribe[]> => {
  EnvStore.getInstance().set(env);

  await initAuth();

  const authSubscribe =
    env.workers?.auth !== undefined ? initAuthTimeoutWorker(env.workers.auth) : undefined;

  return [...(authSubscribe ? [authSubscribe] : [])];
};

export const authSubscribe = (callback: (authUser: User | null) => void): Unsubscribe =>
  AuthStore.getInstance().subscribe(callback);
