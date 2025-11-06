import {executeWithWindowGuard} from '../helpers/window.helpers';
import {GoogleProvider} from '../providers/google.providers';
import {InternetIdentityProvider} from '../providers/internet-identity.providers';
import {WebAuthnProvider} from '../providers/webauthn.providers';
import {AuthClientStore} from '../stores/auth-client.store';
import {AuthStore} from '../stores/auth.store';
import type {SignInOptions, SignUpOptions} from '../types/auth';
import {SignInProviderNotSupportedError, SignUpProviderNotSupportedError} from '../types/errors';
import type {Provider} from '../types/provider';
import {authenticateWithAuthClient} from './_auth-client.services';
import {initUser} from './_user.services';
import {loadAuth, loadAuthWithUser} from './load.services';

/**
 * Initialize the authClient, load or create a new user.
 * Executed on sign-in.
 *
 * ℹ️ Exposed for testing purpose only.
 */
export const createAuth = async ({provider}: {provider: Provider}) => {
  const init = async () => {
    const user = await initUser({provider});
    AuthStore.getInstance().set(user);
  };

  await authenticateWithAuthClient({fn: init});
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
  if ('google' in options) {
    const {
      google: {options: signInOptions}
    } = options;

    await new GoogleProvider().signIn({
      options: signInOptions
    });
    return;
  }

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
      authClient: AuthClientStore.getInstance().getAuthClient(),
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
