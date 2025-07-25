import type {Identity} from '@dfinity/agent';
import {type AuthClient, ERROR_USER_INTERRUPT} from '@dfinity/auth-client';
import {isNullish} from '@dfinity/utils';
import {
  ALLOW_PIN_AUTHENTICATION,
  DELEGATION_IDENTITY_EXPIRATION
} from '../constants/auth.constants';
import {InternetIdentityProvider} from '../providers/auth.providers';
import {ActorStore} from '../stores/actor.store';
import {AgentStore} from '../stores/agent.store';
import {AuthStore} from '../stores/auth.store';
import type {Provider, SignInOptions} from '../types/auth';
import {SignInError, SignInInitError, SignInUserInterruptError} from '../types/errors';
import {createAuthClient} from '../utils/auth.utils';
import {initUser} from './_user.services';

let authClient: AuthClient | undefined | null;

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
 *
 * @param {SignInOptions} [options] - The options for signing in.
 * @returns {Promise<void>} A promise that resolves when the sign-in process is complete and the authenticated user is initialized.
 * @throws {SignInError} If the sign-in process fails or no authentication client is available.
 */
export const signIn = (options?: SignInOptions): Promise<void> =>
  /* eslint-disable no-async-promise-executor */
  new Promise<void>(async (resolve, reject) => {
    if (isNullish(authClient)) {
      reject(
        new SignInInitError(
          'No client is ready to perform a sign-in. Have you initialized the Satellite?'
        )
      );
      return;
    }

    const provider = options?.provider ?? new InternetIdentityProvider({});

    await authClient.login({
      onSuccess: async () => {
        await initAuth(provider.id);
        resolve();
      },
      onError: (error?: string) => {
        if (error === ERROR_USER_INTERRUPT) {
          reject(new SignInUserInterruptError(error));
          return;
        }

        reject(new SignInError(error));
      },
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
  await resetAuth();

  // Recreate an HttpClient immediately because next sign-in, if window is not reloaded, would fail if the agent is created within the process.
  // For example, Safari blocks the Internet Identity (II) window if the agent is created during the interaction.
  // Agent-js must be created either globally or at least before performing a sign-in.
  authClient = await createAuthClient();
};

/**
 * ℹ️ Exposed for testing purpose only. Should not be leaked to consumer or used by the library.
 */
export const resetAuth = async () => {
  await authClient?.logout();

  // Reset local object otherwise next sign in (sign in - sign out - sign in) might not work out - i.e. agent-js might not recreate the delegation or identity if not resetted
  // Technically we do not need this since we recreate the agent below. We just keep it to make the reset explicit.
  authClient = null;

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

/**
 * Returns the current identity if the user is authenticated.
 *
 * ⚠️ Use this function imperatively only. Do **not** persist the identity in global state.
 * It is intended for short-lived or one-time operations.
 *
 * Typical use case is to enable developers to implement custom features for the Internet Computer:
 * - Passing the identity to temporarily create an actor or agent to call a canister
 * - Signing a message or making a one-time authenticated call
 *
 * @returns The authenticated identity, or null if unavailable.
 */
export const getIdentityOnce = async (): Promise<Identity | null> => {
  const user = AuthStore.getInstance().get();

  if (isNullish(user)) {
    return null;
  }

  const authenticated = (await authClient?.isAuthenticated()) ?? false;

  if (!authenticated) {
    return null;
  }

  return authClient?.getIdentity() ?? null;
};
