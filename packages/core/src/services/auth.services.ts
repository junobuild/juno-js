import type {Identity} from '@dfinity/agent';
import type {AuthClient} from '@dfinity/auth-client';
import {
  ALLOW_PIN_AUTHENTICATION,
  DELEGATION_IDENTITY_EXPIRATION
} from '../constants/auth.constants';
import {InternetIdentityProvider} from '../providers/auth.providers';
import {ActorStore} from '../stores/actor.store';
import {AgentStore} from '../stores/agent.store';
import {AuthStore} from '../stores/auth.store';
import type {Provider, SignInOptions} from '../types/auth.types';
import {createAuthClient} from '../utils/auth.utils';
import {initUser} from './user.services';

let authClient: AuthClient | undefined;

export const initAuth = async (provider?: Provider) => {
  authClient = authClient ?? (await createAuthClient());

  const isAuthenticated: boolean = (await authClient?.isAuthenticated()) ?? false;

  if (!isAuthenticated) {
    return;
  }

  const user = await initUser(provider);
  AuthStore.getInstance().set(user);
};

/**
 * Signs in a user with the specified options.
 * @param {SignInOptions} [options] - The options for signing in.
 * @returns {Promise<void>} A promise that resolves when the sign-in process is complete and the authenticated user is initialized.
 * @throws Will throw an error if the sign-in process fails.
 */
export const signIn = (options?: SignInOptions): Promise<void> =>
  /* eslint-disable no-async-promise-executor */
  new Promise<void>(async (resolve, reject) => {
    authClient = authClient ?? (await createAuthClient());

    const provider = options?.provider ?? new InternetIdentityProvider({});

    await authClient.login({
      onSuccess: async () => {
        await initAuth(provider.id);
        resolve();
      },
      onError: (error?: string) => reject(error),
      maxTimeToLive: options?.maxTimeToLive ?? DELEGATION_IDENTITY_EXPIRATION,
      allowPinAuthentication: options?.allowPin ?? ALLOW_PIN_AUTHENTICATION,
      ...(options?.derivationOrigin !== undefined && {derivationOrigin: options.derivationOrigin}),
      ...provider.signInOptions({
        windowed: options?.windowed
      })
    });
  });

/**
 * Signs out the current user.
 * @returns {Promise<void>} A promise that resolves when the sign-out process is complete.
 */
export const signOut = async (): Promise<void> => {
  await authClient?.logout();

  // Reset local object otherwise next sign in (sign in - sign out - sign in) might not work out - i.e. agent-js might not recreate the delegation or identity if not resetted
  authClient = undefined;

  AuthStore.getInstance().reset();

  ActorStore.getInstance().reset();
  AgentStore.getInstance().reset();
};

export const getIdentity = (): Identity | undefined => authClient?.getIdentity();

/**
 * Returns the identity of a signed-in user or an anonymous identity.
 * This function is useful for loading an identity in web workers.
 * Used to imperatively get the identity. Please be certain before using it.
 * @returns {Promise<Identity>} A promise that resolves to the identity of the user or an anonymous identity.
 */
export const unsafeIdentity = async (): Promise<Identity> =>
  (authClient ?? (await createAuthClient())).getIdentity();
