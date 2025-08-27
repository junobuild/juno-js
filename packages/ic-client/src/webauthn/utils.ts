import {nonNullish} from '@dfinity/utils';

export const isWebAuthnAvailable = async (): Promise<boolean> => {
  if (
    nonNullish(window.PublicKeyCredential) &&
    'isUserVerifyingPlatformAuthenticatorAvailable' in PublicKeyCredential
  ) {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  }

  return false;
};
