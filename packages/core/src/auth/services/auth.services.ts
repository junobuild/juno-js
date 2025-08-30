import type {Identity} from '@dfinity/agent';
import type {AuthClient} from '@dfinity/auth-client';
import {isNullish} from '@dfinity/utils';
import {ActorStore} from '../../core/stores/actor.store';
import {AgentStore} from '../../core/stores/agent.store';
import {executeWithWindowGuard} from '../helpers/window.helpers';
import {InternetIdentityProvider} from '../providers/internet-identity.providers';
import {NFIDProvider} from '../providers/nfid.providers';
import {WebAuthnProvider} from '../providers/webauthn.providers';
import {AuthStore} from '../stores/auth.store';
import type {SignInOptions} from '../types/auth';
import type {Provider} from '../types/provider';
import {createAuthClient} from '../utils/auth.utils';
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

  await executeAuth({fn: init});
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

  await executeAuth({fn: init});
};

const executeAuth = async ({fn}: {fn: () => Promise<void>}) => {
  authClient = authClient ?? (await createAuthClient());

  const isAuthenticated = await authClient.isAuthenticated();

  if (!isAuthenticated) {
    return;
  }

  await fn();
};

/**
 * Signs in a user with the specified options.
 *
 * @param {SignInOptions} [options] - The options for signing in.
 * @returns {Promise<void>} A promise that resolves when the sign-in process is complete and the authenticated user is initialized.
 * @throws {SignInError} If the sign-in process fails or no authentication client is available.
 */
export const signIn = async (options?: SignInOptions): Promise<void> => {
  const opts = options ?? {internet_identity: {}};
  const fn = async () => await signInWithProvider(opts);

  const disableWindowGuard = Object.values(opts)?.[0].context?.windowGuard === false;

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

  if ('nfid' in options) {
    const {
      nfid: {config, options: signInOptions}
    } = options;

    await new NFIDProvider(config).signIn({
      options: signInOptions,
      authClient,
      initAuth: createAuth
    });
    return;
  }

  const {
    internet_identity: {config, options: signInOptions}
  } = options;

  await new InternetIdentityProvider(config).signIn({
    options: signInOptions,
    authClient,
    initAuth: createAuth
  });
};

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
