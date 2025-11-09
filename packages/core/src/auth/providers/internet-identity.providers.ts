import {isEmptyString, isNullish, nonNullish} from '@dfinity/utils';
import {
  DOCKER_CONTAINER_URL,
  DOCKER_INTERNET_IDENTITY_ID
} from '../../core/constants/container.constants';
import {EnvStore} from '../../core/stores/env.store';
import {
  IC0_APP,
  ID_AI,
  II_DESIGN_V1_POPUP,
  II_DESIGN_V2_POPUP,
  INTERNET_COMPUTER_ORG
} from '../constants/auth.constants';
import type {AuthClientSignInOptions} from '../types/auth-client';
import type {InternetIdentityConfig, InternetIdentityDomain} from '../types/internet-identity';
import type {ProviderWithoutData} from '../types/provider';
import {popupCenter} from '../utils/window.utils';
import {AuthClientProvider, type AuthProviderSignInOptions} from './_auth-client.providers';

/**
 * Internet Identity authentication provider.
 * @class InternetIdentityProvider
 */
export class InternetIdentityProvider extends AuthClientProvider {
  #domain?: InternetIdentityDomain;

  /**
   * Creates an instance of InternetIdentityProvider.
   * @param {InternetIdentityConfig} config - The configuration for Internet Identity.
   */
  constructor({domain}: InternetIdentityConfig) {
    super();

    this.#domain = domain;
  }

  /**
   * Gets the identifier of the provider.
   * @returns {Provider} The identifier of the provider - `internet_identity`.
   */
  override get id(): ProviderWithoutData {
    return 'internet_identity';
  }

  /**
   * Gets the sign-in options for Internet Identity.
   * @param {Pick<SignInOptions, 'windowed'>} options - The sign-in options.
   * @returns {AuthProviderSignInOptions} The sign-in options for Internet Identity.
   */
  override signInOptions({
    windowed
  }: Pick<AuthClientSignInOptions, 'windowed'>): AuthProviderSignInOptions {
    const identityProviderUrl = (): string => {
      const container = EnvStore.getInstance().get()?.container;

      // Production
      if (isNullish(container) || container === false) {
        const identityV1Domain = [INTERNET_COMPUTER_ORG, IC0_APP].includes(
          this.#domain ?? INTERNET_COMPUTER_ORG
        );

        if (isEmptyString(this.#domain)) {
          return `https://identity.${INTERNET_COMPUTER_ORG}`;
        }

        if (identityV1Domain) {
          return `https://identity.${this.#domain ?? INTERNET_COMPUTER_ORG}`;
        }

        return `https://${this.#domain}`;
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

    const identityProvider = identityProviderUrl();

    const iiDesignV2 = (): boolean => {
      try {
        const {hostname} = new URL(identityProvider);
        return hostname.includes(ID_AI);
      } catch {
        return false;
      }
    };

    return {
      ...(windowed !== false && {
        windowOpenerFeatures: popupCenter(iiDesignV2() ? II_DESIGN_V2_POPUP : II_DESIGN_V1_POPUP)
      }),
      identityProvider
    };
  }
}
