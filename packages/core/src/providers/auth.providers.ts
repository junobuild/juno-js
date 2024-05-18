import {isNullish, nonNullish} from '@junobuild/utils';
import {II_POPUP, INTERNET_COMPUTER_ORG, NFID_POPUP} from '../constants/auth.constants';
import {DOCKER_CONTAINER_URL, DOCKER_INTERNET_IDENTITY_ID} from '../constants/container.constants';
import {EnvStore} from '../stores/env.store';
import type {
  InternetIdentityConfig,
  InternetIdentityDomain,
  NFIDConfig,
  Provider,
  SignInOptions
} from '../types/auth.types';
import {popupCenter} from '../utils/window.utils';

/**
 * Options for signing in with an authentication provider.
 * @interface AuthProviderSignInOptions
 */
export interface AuthProviderSignInOptions {
  /**
   * The URL of the identity provider - commonly Internet Identity.
   */
  identityProvider: string;
  /**
   * Optional features for the window opener.
   */
  windowOpenerFeatures?: string;
}

/**
 * Common traits for all authentication providers
 * @interface AuthProvider
 */
export interface AuthProvider {
  /**
   * The unique identifier of the provider.
   */
  readonly id: Provider;
  /**
   * Method to get the sign-in options for the provider.
   * @param options - The sign-in options.
   * @returns The sign-in options for the provider that can be use to effectively perform a sign-in.
   */
  signInOptions: (options: Pick<SignInOptions, 'windowed'>) => AuthProviderSignInOptions;
}

/**
 * Internet Identity authentication provider.
 * @class InternetIdentityProvider
 * @implements {AuthProvider}
 */
export class InternetIdentityProvider implements AuthProvider {
  #domain?: InternetIdentityDomain;

  /**
   * Creates an instance of InternetIdentityProvider.
   * @param {InternetIdentityConfig} config - The configuration for Internet Identity.
   */
  constructor({domain}: InternetIdentityConfig) {
    this.#domain = domain;
  }

  /**
   * Gets the identifier of the provider.
   * @returns {Provider} The identifier of the provider - `internet_identity`.
   */
  get id(): Provider {
    return 'internet_identity';
  }

  /**
   * Gets the sign-in options for Internet Identity.
   * @param {Pick<SignInOptions, 'windowed'>} options - The sign-in options.
   * @returns {AuthProviderSignInOptions} The sign-in options for Internet Identity.
   */
  signInOptions({windowed}: Pick<SignInOptions, 'windowed'>): AuthProviderSignInOptions {
    const identityProviderUrl = (): string => {
      const container = EnvStore.getInstance().get()?.container;

      // Production
      if (isNullish(container) || container === false) {
        return `https://identity.${this.#domain ?? INTERNET_COMPUTER_ORG}`;
      }

      const env = EnvStore.getInstance().get();

      const internetIdentityId =
        nonNullish(env) && nonNullish(env?.internetIdentityId)
          ? env.internetIdentityId
          : DOCKER_INTERNET_IDENTITY_ID;

      const {host: containerHost, protocol} = new URL(
        container === true ? DOCKER_CONTAINER_URL : container
      );

      return /apple/i.test(navigator?.vendor)
        ? `${protocol}//${containerHost}?canisterId=${internetIdentityId}`
        : `${protocol}//${internetIdentityId}.${containerHost.replace('127.0.0.1', 'localhost')}`;
    };

    return {
      ...(windowed !== false && {
        windowOpenerFeatures: popupCenter(II_POPUP)
      }),
      identityProvider: identityProviderUrl()
    };
  }
}

/**
 * NFID authentication provider.
 * @class NFIDProvider
 * @implements {AuthProvider}
 */
export class NFIDProvider implements AuthProvider {
  #appName: string;
  #logoUrl: string;

  /**
   * Creates an instance of NFIDProvider.
   * @param {NFIDConfig} config - The configuration for NFID.
   */
  constructor({appName, logoUrl}: NFIDConfig) {
    this.#appName = appName;
    this.#logoUrl = logoUrl;
  }

  /**
   * Gets the identifier of the provider.
   * @returns {Provider} The identifier of the provider- nfid.
   */
  get id(): Provider {
    return 'nfid';
  }

  /**
   * Gets the sign-in options for NFID.
   * @param {Pick<SignInOptions, 'windowed'>} options - The sign-in options.
   * @returns {AuthProviderSignInOptions} The sign-in options to effectively sign-in with NFID.
   */
  signInOptions({windowed}: Pick<SignInOptions, 'windowed'>): AuthProviderSignInOptions {
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
