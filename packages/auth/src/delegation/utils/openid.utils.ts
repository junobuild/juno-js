/**
 * Detects whether the browser supports FedCM (Federated Credential Management).
 *
 * @returns {boolean} `true` if FedCM is supported, otherwise `false`.
 *
 * References:
 *  - MDN IdentityCredential: https://developer.mozilla.org/en-US/docs/Web/API/IdentityCredential
 */
export const isFedCMSupported = (): boolean => {
  const {userAgent} = navigator;

  // Samsung browser implements "IdentityCredential" but does not support "configURL"
  // https://developer.mozilla.org/en-US/docs/Web/API/IdentityCredential
  const isSamsungBrowser = /SamsungBrowser/i.test(userAgent);
  if (isSamsungBrowser) {
    return false;
  }

  return 'IdentityCredential' in window;
};
