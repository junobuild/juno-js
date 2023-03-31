import {AuthClient} from '@dfinity/auth-client';
import {II_POPUP, INTERNET_COMPUTER_ORG, NFID_POPUP} from '../constants/auth.constants';
import {InternetIdentityProvider, NFIDProvider} from '../providers/auth.providers';
import {SignInOptions, SignInProvider} from '../types/auth.types';
import {popupCenter} from './window.utils';

export const createAuthClient = (): Promise<AuthClient> =>
  AuthClient.create({
    idleOptions: {
      disableIdle: true,
      disableDefaultIdleCallback: true
    }
  });

const isNFID = (provider: SignInProvider | undefined): provider is NFIDProvider => {
  return provider instanceof NFIDProvider;
};

export const identityProvider = (provider: SignInProvider | undefined): string => {
  // TODO: uncomment
  // if (EnvStore.getInstance().localIdentity()) {
  //   return `http://${EnvStore.getInstance().get()?.localIdentityCanisterId}.localhost:8000`;
  // }

  if (isNFID(provider)) {
    const {logoUrl, appName} = provider;
    return `https://nfid.one/authenticate/?applicationName=${encodeURI(
      appName
    )}&applicationLogo=${encodeURI(logoUrl)}`;
  }

  const {domain} = provider ?? new InternetIdentityProvider({domain: INTERNET_COMPUTER_ORG});

  return `https://identity.${domain ?? INTERNET_COMPUTER_ORG}`;
};

export const signInProvider = (
  options?: SignInOptions
): {
  identityProvider: string;
  windowOpenerFeatures?: string;
} => ({
  ...(options?.windowed !== false && {
    windowOpenerFeatures: popupCenter(isNFID(options?.provider) ? NFID_POPUP : II_POPUP)
  }),
  identityProvider: identityProvider(options?.provider)
});
