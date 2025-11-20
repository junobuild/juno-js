import {assertNonNullish} from '@dfinity/utils';
import {isWebAuthnAvailable} from '@junobuild/ic-client/webauthn';
import type {Asset, AssetEncoding, AssetKey, EncodingType, Storage} from '@junobuild/storage';
import {initAuthTimeoutWorker} from './auth/services/auth-timout.services';
import {loadAuth} from './auth/services/load.services';
import {AuthStore} from './auth/stores/auth.store';
import type {User} from './auth/types/user';
import {EnvStore} from './core/stores/env.store';
import type {Environment, UserEnvironment} from './core/types/env';
import type {Unsubscribe} from './core/types/subscription';
import {envContainer, envSatelliteId} from './core/utils/window.env.utils';
export * from './auth/providers/internet-identity.providers';
export {getIdentityOnce, unsafeIdentity} from './auth/services/identity.services';
export {handleRedirectCallback} from './auth/services/redirect.services';
export {signIn} from './auth/services/sign-in.services';
export {signOut} from './auth/services/sign-out.services';
export {signUp} from './auth/services/sign-up.services';
export type * from './auth/types/auth';
export * from './auth/types/auth-client';
export * from './auth/types/errors';
export type * from './auth/types/progress';
export type * from './auth/types/provider';
export type * from './auth/types/user';
export * from './auth/types/webauthn';
export * from './auth/utils/user.utils';
export type * from './core/types/env';
export {ListOrder, ListPaginate, ListParams, ListResults} from './core/types/list';
export type * from './core/types/satellite';
export type * from './core/types/subscription';
export type * from './core/types/utility';
export * from './datastore/services/doc.services';
export type * from './datastore/types/doc';
export * from './functions/services/functions.services';
export * from './storage/services/storage.services';
export type * from './storage/types/storage';
export {isWebAuthnAvailable};
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
 * @deprecated Use {@link initSatellite} instead.
 */
export const initJuno = (userEnv?: UserEnvironment): Promise<Unsubscribe[]> =>
  initSatellite(userEnv);

/**
 * Initializes a Satellite with the provided optional environment parameters.
 * If no environment is provided, the variables injected by the Vite or NextJS plugins will be used.
 * @param {UserEnvironment} [userEnv] - The optional user environment configuration.
 * @returns {Promise<Unsubscribe[]>} A promise that resolves to an array of unsubscribe functions.
 */
export const initSatellite = async (userEnv?: UserEnvironment): Promise<Unsubscribe[]> => {
  const env = parseEnv(userEnv);

  EnvStore.getInstance().set(env);

  await loadAuth();

  const authSubscribe =
    env.workers?.auth !== undefined ? initAuthTimeoutWorker(env.workers.auth) : undefined;

  return [...(authSubscribe ? [authSubscribe] : [])];
};

/**
 * Subscribes to authentication state changes. i.e. each time a user signs in or signs out, the callback will be triggered.
 * @param {function(User | null): void} callback - The callback function to execute when the authentication state changes.
 * @returns {Unsubscribe} A function to unsubscribe from the authentication state changes.
 */
export const onAuthStateChange = (callback: (authUser: User | null) => void): Unsubscribe =>
  AuthStore.getInstance().subscribe(callback);

/**
 * @deprecated Use {@link onAuthStateChange} instead.
 */
export const authSubscribe = onAuthStateChange;
export {InternetIdentityConfig, InternetIdentityDomain} from './auth/types/internet-identity';
