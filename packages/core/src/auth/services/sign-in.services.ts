import {executeWithWindowGuard} from '../helpers/window.helpers';
import {GoogleProvider} from '../providers/google.providers';
import {InternetIdentityProvider} from '../providers/internet-identity.providers';
import {WebAuthnProvider} from '../providers/webauthn.providers';
import {AuthClientStore} from '../stores/auth-client.store';
import {AuthStore} from '../stores/auth.store';
import type {SignInContext, SignInOptions} from '../types/auth';
import {SignInProviderNotSupportedError} from '../types/errors';
import type {ProviderWithoutData} from '../types/provider';
import {authenticateWithAuthClient} from './_auth-client.services';
import {initUser} from './_user.services';
import {loadAuth} from './load.services';

/**
 * Initialize the authClient, load or create a new user.
 * Executed on sign-in.
 *
 * ℹ️ Exposed for testing purpose only.
 */
export const createAuth = async ({provider}: {provider: ProviderWithoutData}) => {
  const init = async () => {
    const user = await initUser({provider});
    AuthStore.getInstance().set(user);
  };

  await authenticateWithAuthClient({fn: init, broadcast: true});
};

/**
 * Signs in a user with the specified options.
 *
 * @default Signs in by default with Internet Identity
 * @param {SignInOptions} [options] - The options for signing in including the provider to use for the process.
 * @returns {Promise<void>} A promise that resolves when the sign-in process is complete and the authenticated user is initialized.
 */
export const signIn = async (options: SignInOptions): Promise<void> => {
  if ('google' in options) {
    const {
      google: {options: signInOptions}
    } = options;

    const fn = (): Promise<void> =>
      new GoogleProvider().signIn({
        options: signInOptions
      });

    await signInWithContext({
      fn,
      context: {windowGuard: false}
    });

    return;
  }

  if ('webauthn' in options) {
    const {
      webauthn: {options: signInOptions, context}
    } = options;

    const fn = (): Promise<void> =>
      new WebAuthnProvider().signIn({
        options: signInOptions,
        loadAuth: (): Promise<void> => loadAuth({broadcast: true})
      });

    await signInWithContext({fn, context});

    return;
  }

  if ('internet_identity' in options) {
    const {
      internet_identity: {options: iiOptions, context}
    } = options;

    const {domain, ...signInOptions} = iiOptions ?? {};

    const fn = (): Promise<void> =>
      new InternetIdentityProvider({domain}).signIn({
        options: signInOptions,
        authClient: AuthClientStore.getInstance().getAuthClient(),
        initAuth: createAuth
      });

    await signInWithContext({fn, context});

    return;
  }

  throw new SignInProviderNotSupportedError(
    'An unknown or unsupported provider was provided for sign-in.'
  );
};

const signInWithContext = async ({
  fn,
  context
}: {
  fn: () => Promise<void>;
  context?: SignInContext;
}): Promise<void> => {
  const disableWindowGuard = context?.windowGuard === false;

  if (disableWindowGuard) {
    await fn();
    return;
  }

  await executeWithWindowGuard({fn});
};
