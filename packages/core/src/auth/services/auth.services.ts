import {isNullish} from '@dfinity/utils';
import type {AuthClient} from '@icp-sdk/auth/client';
import type {Identity} from '@icp-sdk/core/agent';
import {ActorStore} from '../../core/stores/actor.store';
import {AgentStore} from '../../core/stores/agent.store';
import {executeWithWindowGuard} from '../helpers/window.helpers';
import {InternetIdentityProvider} from '../providers/internet-identity.providers';
import {WebAuthnProvider} from '../providers/webauthn.providers';
import {AuthStore} from '../stores/auth.store';
import type {SignInOptions, SignOutOptions, SignUpOptions} from '../types/auth';
import {SignInProviderNotSupportedError, SignUpProviderNotSupportedError} from '../types/errors';
import type {Provider} from '../types/provider';
import type {User} from '../types/user';
import {createAuthClient, resetAuthClient} from '../utils/auth.utils';
import {initUser, loadUser} from './_user.services';

let authClient: AuthClient | undefined | null;

/**
 * Initialize the authClient and load the existing user.
 * Executed when the library is initialized through initSatellite.
 */
export const loadAuth = async () => {
  const init = async () => {
    const {user} = await loadUser();
    AuthStore.getInstance().set(user ?? null);
  };

  await authenticate({fn: init});
};

/**
 * Initialize the authClient, load the user passed as parameter.
 * Executed on sign-up.
 */
const loadAuthWithUser = async ({user}: {user: User}) => {
  // eslint-disable-next-line require-await
  const init = async () => {
    AuthStore.getInstance().set(user);
  };

  await authenticate({fn: init});
};

/**
 * Initialize the authClient, load or create a new user.
 * Executed on sign-in.
 */
export const createAuth = async ({provider}: {provider: Provider}) => {
  const init = async () => {
    const user = await initUser({provider});
    AuthStore.getInstance().set(user);
  };

  await authenticate({fn: init});
};

/**
 * Initializes a new `AuthClient`, checks authentication state,
 * and executes the provided function if already authenticated.
 *
 * - Always creates a fresh `AuthClient` using {@link createAuthClient}.
 * - If the client is **not authenticated**, it resets the client via {@link resetAuthClient}
 *   to ensure a clean session.
 * - If authenticated, it runs the given async function `fn`.
 *
 * @param {Object} params
 * @param {() => Promise<void>} params.fn - The asynchronous function to execute when authenticated.
 *
 * @returns {Promise<void>} Resolves when authentication is handled and the provided function is executed (if applicable).
 */
const authenticate = async ({fn}: {fn: () => Promise<void>}) => {
  authClient = await createAuthClient();

  const isAuthenticated = await authClient.isAuthenticated();

  if (!isAuthenticated) {
    authClient = await resetAuthClient();
    return;
  }

  await fn();
};

/**
 * Signs in a user with the specified options.
 *
 * @default Signs in by default with Internet Identity
 * @param {SignInOptions} [options] - The options for signing in including the provider to use for the process.
 * @returns {Promise<void>} A promise that resolves when the sign-in process is complete and the authenticated user is initialized.
 */
export const signIn = async (options: SignInOptions): Promise<void> => {
  const fn = async () => await signInWithProvider(options);

  const disableWindowGuard = Object.values(options)[0].context?.windowGuard === false;

  if (disableWindowGuard) {
    await fn();
    return;
  }

  await executeWithWindowGuard({fn});
};

/**
 * Signs up to create a new user with the specified options.
 *
 * @param {SignUpOptions} [options] - The options for signing up including the provider to use for the process.
 * @returns {Promise<void>} A promise that resolves when the sign-up process is complete and the user is authenticated.
 */
export const signUp = async (options: SignUpOptions): Promise<void> => {
  const fn = async () => await signUpWithProvider(options);

  const disableWindowGuard = Object.values(options)?.[0].context?.windowGuard === false;

  if (disableWindowGuard) {
    await fn();
    return;
  }

  await executeWithWindowGuard({fn});
};

const signInWithProvider = async (options: SignInOptions): Promise<void> => {
  if ('webauthn' in options) {
    const {
      webauthn: {options: signInOptions}
    } = options;

    await new WebAuthnProvider().signIn({
      options: signInOptions,
      loadAuth
    });
    return;
  }

  if ('internet_identity' in options) {
    const {
      internet_identity: {options: iiOptions}
    } = options;

    const {domain, ...signInOptions} = iiOptions ?? {};

    await new InternetIdentityProvider({domain}).signIn({
      options: signInOptions,
      authClient,
      initAuth: createAuth
    });
    return;
  }

  throw new SignInProviderNotSupportedError(
    'An unknown or unsupported provider was provided for sign-in.'
  );
};

const signUpWithProvider = async (options: SignUpOptions): Promise<void> => {
  if ('webauthn' in options) {
    const {
      webauthn: {options: signUpOptions}
    } = options;

    await new WebAuthnProvider().signUp({
      options: signUpOptions,
      loadAuthWithUser
    });
    return;
  }

  throw new SignUpProviderNotSupportedError(
    'An unknown or unsupported provider was provided for sign-up.'
  );
};

/**
 * Signs out the current user.
 * @returns {Promise<void>} A promise that resolves when the sign-out process is complete.
 */
export const signOut = async (options?: SignOutOptions): Promise<void> => {
  await resetAuth();

  // Recreate an HttpClient immediately because next sign-in, if window is not reloaded, would fail if the agent is created within the process.
  // For example, Safari blocks the Internet Identity (II) window if the agent is created during the interaction.
  // Agent-js must be created either globally or at least before performing a sign-in.
  // We proceed with this reset regardless of the window reloading. This way we ensure it is reset not matter what.
  authClient = await createAuthClient();

  if (options?.windowReload === false) {
    return;
  }

  window.location.reload();
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
