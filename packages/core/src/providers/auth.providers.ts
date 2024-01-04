import {isNullish, nonNullish} from '@junobuild/utils';
import {II_POPUP, INTERNET_COMPUTER_ORG, NFID_POPUP} from '../constants/auth.constants';
import {DOCKER_INTERNET_IDENTITY_ID} from '../constants/container.constants';
import {EnvStore} from '../stores/env.store';
import type {Provider, SignInOptions} from '../types/auth.types';
import {popupCenter} from '../utils/window.utils';

export interface AuthProvider {
  readonly id: Provider;
  signInOptions: (options: Pick<SignInOptions, 'windowed'>) => {
    identityProvider: string;
    windowOpenerFeatures?: string;
  };
}

export class InternetIdentityProvider implements AuthProvider {
  #domain?: 'internetcomputer.org' | 'ic0.app';

  constructor({domain}: {domain?: 'internetcomputer.org' | 'ic0.app'}) {
    this.#domain = domain;
  }

  get id(): Provider {
    return 'internet_identity';
  }

  signInOptions({windowed}: Pick<SignInOptions, 'windowed'>): {
    identityProvider: string;
    windowOpenerFeatures?: string;
  } {
    const identityProviderUrl = (): string => {
      const container = EnvStore.getInstance().get()?.container;

      // Production
      if (isNullish(container)) {
        return `https://identity.${this.#domain ?? INTERNET_COMPUTER_ORG}`;
      }

      const env = EnvStore.getInstance().get();

      const internetIdentityId = nonNullish(env?.internetIdentityId) ?? DOCKER_INTERNET_IDENTITY_ID;

      const {host: containerHost, protocol} = new URL(container);

      return /apple/i.test(navigator?.vendor)
        ? `${protocol}://${containerHost}?canisterId=${internetIdentityId}`
        : `${protocol}://${internetIdentityId}.${containerHost}`;
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

  constructor({appName, logoUrl}: {appName: string; logoUrl: string}) {
    this.#appName = appName;
    this.#logoUrl = logoUrl;
  }

  get id(): Provider {
    return 'nfid';
  }

  signInOptions({windowed}: Pick<SignInOptions, 'windowed'>): {
    identityProvider: string;
    windowOpenerFeatures?: string;
  } {
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
