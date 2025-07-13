import {assertNonNullish} from '@dfinity/utils';
import type {Asset, AssetEncoding, AssetKey, EncodingType, Storage} from '@junobuild/storage';
import {initAuthTimeoutWorker} from './services/auth-timout.services';
import {initAuth} from './services/auth.services';
import {AuthStore} from './stores/auth.store';
import {EnvStore} from './stores/env.store';
import type {User} from './types/auth.types';
import type {Environment, UserEnvironment} from './types/env.types';
import type {Unsubscribe} from './types/subscription.types';
import {envContainer, envSatelliteId} from './utils/window.env.utils';
export * from './providers/auth.providers';
export {getIdentityOnce, signIn, signOut, unsafeIdentity} from './services/auth.services';
export * from './services/doc.services';
export * from './services/functions.services';
export * from './services/storage.services';
export type * from './types/auth.types';
export type * from './types/doc.types';
export type * from './types/env.types';
export * from './types/errors.types';
export {ListOrder, ListPaginate, ListParams, ListResults} from './types/list.types';
export type * from './types/satellite.types';
export type * from './types/storage.types';
export type * from './types/subscription.types';
export type * from './types/utility.types';
export type {Asset, AssetEncoding, AssetKey, EncodingType, Storage};

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

/**
 * Initializes Juno with the provided optional environment parameters.
 * If no environment is provided, the variables injected by the Vite or NextJS plugins will be used.
 * @deprecated Use {@link initSatellite} instead.
 * @param {UserEnvironment} [userEnv] - The optional user environment configuration.
 * @returns {Promise<Unsubscribe[]>} A promise that resolves to an array of unsubscribe functions.
 */
export const initJuno = (userEnv?: UserEnvironment): Promise<Unsubscribe[]> =>
  initSatellite(userEnv);

/**
 * Initializes a Juno satellite with the provided optional environment parameters.
 * If no environment is provided, the variables injected by the Vite or NextJS plugins will be used.
 * @param {UserEnvironment} [userEnv] - The optional user environment configuration.
 * @returns {Promise<Unsubscribe[]>} A promise that resolves to an array of unsubscribe functions.
 */
export const initSatellite = async (userEnv?: UserEnvironment): Promise<Unsubscribe[]> => {
  const env = parseEnv(userEnv);

  EnvStore.getInstance().set(env);

  await initAuth();

  const authSubscribe =
    env.workers?.auth !== undefined ? initAuthTimeoutWorker(env.workers.auth) : undefined;

  return [...(authSubscribe ? [authSubscribe] : [])];
};

/**
 * Subscribes to authentication state changes. i.e. each time a user signs in or signs out, the callback will be triggered.
 * @param {function(User | null): void} callback - The callback function to execute when the authentication state changes.
 * @returns {Unsubscribe} A function to unsubscribe from the authentication state changes.
 */
export const authSubscribe = (callback: (authUser: User | null) => void): Unsubscribe =>
  AuthStore.getInstance().subscribe(callback);
