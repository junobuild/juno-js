import {executeWithWindowGuard} from '../helpers/window.helpers';
import {WebAuthnProvider} from '../providers/webauthn.providers';
import type {SignUpOptions} from '../types/auth';
import {SignUpProviderNotSupportedError} from '../types/errors';
import {loadAuthWithUser} from './load.services';

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
