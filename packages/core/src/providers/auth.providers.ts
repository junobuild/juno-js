import {II_POPUP, INTERNET_COMPUTER_ORG, NFID_POPUP} from '../constants/auth.constants';
import {EnvStore} from '../stores/env.store';
import {SignInOptions} from '../types/auth.types';
import {popupCenter} from '../utils/window.utils';

export interface SignInProvider {
  signInOptions: (options: Pick<SignInOptions, 'windowed'>) => {
    identityProvider: string;
    windowOpenerFeatures?: string;
  };
}

export class InternetIdentityProvider implements SignInProvider {
  #domain?: 'internetcomputer.org' | 'ic0.app';

  constructor({domain}: {domain?: 'internetcomputer.org' | 'ic0.app'}) {
    this.#domain = domain;
  }

  signInOptions({windowed}: Pick<SignInOptions, 'windowed'>): {
    identityProvider: string;
    windowOpenerFeatures?: string;
  } {
    const identityProvider = EnvStore.getInstance().localIdentity()
      ? `http://${EnvStore.getInstance().get()?.localIdentityCanisterId}.localhost:8000`
      : `https://identity.${this.#domain ?? INTERNET_COMPUTER_ORG}`;

    return {
      ...(windowed !== false && {
        windowOpenerFeatures: popupCenter(II_POPUP)
      }),
      identityProvider
    };
  }
}

export class NFIDProvider implements SignInProvider {
  #appName: string;
  #logoUrl: string;

  constructor({appName, logoUrl}: {appName: string; logoUrl: string}) {
    this.#appName = appName;
    this.#logoUrl = logoUrl;
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
