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

export interface AuthProviderSignInOptions {
  identityProvider: string;
  windowOpenerFeatures?: string;
}

export interface AuthProvider {
  readonly id: Provider;
  signInOptions: (options: Pick<SignInOptions, 'windowed'>) => AuthProviderSignInOptions;
}

export class InternetIdentityProvider implements AuthProvider {
  #domain?: InternetIdentityDomain;

  constructor({domain}: InternetIdentityConfig) {
    this.#domain = domain;
  }

  get id(): Provider {
    return 'internet_identity';
  }

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

export class NFIDProvider implements AuthProvider {
  #appName: string;
  #logoUrl: string;

  constructor({appName, logoUrl}: NFIDConfig) {
    this.#appName = appName;
    this.#logoUrl = logoUrl;
  }

  get id(): Provider {
    return 'nfid';
  }

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
