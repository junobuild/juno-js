import {nonNullish} from '@dfinity/utils';

/**
 * Checks if a user-verifying platform authenticator (passkeys) is available on this device / browser.
 *
 * Returns `true` when:
 * 1) `window.PublicKeyCredential` exists, and
 * 2) the browser reports a user-verifying **platform** authenticator is available
 *    (e.g., Touch ID, Windows Hello, Android biometrics/PIN).
 *
 * @returns {Promise<boolean>} `true` if an authenticator is available, otherwise `false`.
 */
export const isWebAuthnAvailable = async (): Promise<boolean> => {
  if (
    nonNullish(window.PublicKeyCredential) &&
    'isUserVerifyingPlatformAuthenticatorAvailable' in PublicKeyCredential
  ) {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  }

  return false;
};
