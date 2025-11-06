import type {Provider} from '../types/provider';
import type {WebAuthnSignInOptions} from '../types/webauthn';
import type {AuthProvider} from './_auth.providers';
import {GoogleSignInOptions} from '../types/google';

export class GoogleProvider implements AuthProvider {
  /**
   * Gets the identifier of the provider.
   * @returns {Provider} The identifier of the provider is google.
   */
  get id(): Provider {
    return 'google';
  }

  /**
   * Signs in a user with Google.
   *
   * @param {Object} params - The sign-in parameters.
   * @param {GoogleSignInOptions} [params.options] - Optional configuration for the login request.
   * @param {loadAuth} params.loadAuth - The function to load the user. Provided as a callback to avoid recursive import.
   *
   * @returns {Promise<void>} Resolves if the sign-in is successful.
   */
  async signIn({
    options: {} = {},
    loadAuth
  }: {
    options?: GoogleSignInOptions;
    loadAuth: () => Promise<void>;
  }) {

  }
}
