import {NFID_POPUP} from '../constants/auth.constants';
import type {AuthClientSignInOptions} from '../types/auth-client';
import type {NFIDConfig} from '../types/nfid';
import type {Provider} from '../types/provider';
import {popupCenter} from '../utils/window.utils';
import {AuthClientProvider, type AuthProviderSignInOptions} from './_auth-client.providers';

/**
 * NFID authentication provider.
 * @class NFIDProvider
 * @implements {AuthProvider}
 */
export class NFIDProvider extends AuthClientProvider {
  #appName: string;
  #logoUrl: string;

  /**
   * Creates an instance of NFIDProvider.
   * @param {NFIDConfig} config - The configuration for NFID.
   */
  constructor({appName, logoUrl}: NFIDConfig) {
    super();

    this.#appName = appName;
    this.#logoUrl = logoUrl;
  }

  /**
   * Gets the identifier of the provider.
   * @returns {Provider} The identifier of the provider- nfid.
   */
  override get id(): Provider {
    return 'nfid';
  }

  /**
   * Gets the sign-in options for NFID.
   * @param {Pick<SignInOptions, 'windowed'>} options - The sign-in options.
   * @returns {AuthProviderSignInOptions} The sign-in options to effectively sign-in with NFID.
   */
  override signInOptions({
    windowed
  }: Pick<AuthClientSignInOptions, 'windowed'>): AuthProviderSignInOptions {
    return {
      ...(windowed !== false && {
        windowOpenerFeatures: popupCenter(NFID_POPUP)
      }),
      identityProvider: `https://nfid.one/authenticate/?applicationName=${encodeURI(
        this.#appName
      )}&applicationLogo=${encodeURI(this.#logoUrl)}`
    };
  }
}
