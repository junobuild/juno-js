import {isNullish, notEmptyString} from '@dfinity/utils';
import {
  FedCMIdentityCredentialInvalidError,
  FedCMIdentityCredentialUndefinedError
} from '../../errors';
import {parseUrl} from '../../utils/url.utils';
import type {RequestGoogleJwtWithCredentials, RequestGoogleJwtWithRedirect} from './types/openid';

/**
 * Initiates an OpenID Connect authorization request by redirecting the browser.
 *
 *  References:
 *  - OAuth 2.0 (Google): https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow
 *  - OpenID Connect: https://developers.google.com/identity/openid-connect/openid-connect
 */
export const requestGoogleJwtWithRedirect = ({
  authUrl,
  clientId,
  nonce,
  loginHint,
  authScopes,
  state,
  redirectUrl
}: RequestGoogleJwtWithRedirect) => {
  const requestUrl = parseUrl({url: authUrl});

  requestUrl.searchParams.set('client_id', clientId);

  const {
    location: {origin: currentUrl}
  } = window;

  requestUrl.searchParams.set('redirect_uri', redirectUrl ?? currentUrl);

  // We do not request "token" because we use the ID token (JWT).
  // "code" is required according to II's codebase as Apple ID throws an error otherwise.
  requestUrl.searchParams.set('response_type', 'code id_token');

  requestUrl.searchParams.set('scope', authScopes.join(' '));

  // Used for security reasons. When the provider redirects to the application,
  // the state will be compared with the session storage value.
  requestUrl.searchParams.set('state', state);

  // Used to validate the JSON Web Token (JWT) in the backend — i.e. we pass the nonce
  // to the provider and make the request to the backend with its salt.
  requestUrl.searchParams.set('nonce', nonce);

  if (notEmptyString(loginHint)) {
    requestUrl.searchParams.set('login_hint', loginHint);
  } else {
    requestUrl.searchParams.set('prompt', 'select_account');
  }

  window.location.href = requestUrl.toString();
};

/**
 * References:
 * - identity spec: https://www.w3.org/TR/fedcm/#browser-api-credential-request-options
 * - https://privacysandbox.google.com/cookies/fedcm/implement/identity-provider
 * - https://privacysandbox.google.com/cookies/fedcm/why
 */
export const requestGoogleJwtWithCredentials = async ({
  configUrl: configURL,
  clientId,
  nonce,
  loginHint,
  domainHint
}: RequestGoogleJwtWithCredentials): Promise<{jwt: string}> => {
  const identityCredential = await navigator.credentials.get({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    identity: {
      context: 'use',
      providers: [
        {
          configURL,
          clientId,
          nonce,
          loginHint,
          domainHint
        }
      ],
      mode: 'active'
    },
    // https://privacysandbox.google.com/cookies/fedcm/implement/relying-party#auto-reauthn
    mediation: 'required'
  });

  if (isNullish(identityCredential)) {
    throw new FedCMIdentityCredentialUndefinedError();
  }

  const {type} = identityCredential;

  if (
    type !== 'identity' ||
    !('token' in identityCredential) ||
    typeof identityCredential.token !== 'string'
  ) {
    // This should be unreachable in FedCM spec-compliant browsers.
    throw new FedCMIdentityCredentialInvalidError('Invalid credential received from FedCM API', {
      cause: identityCredential
    });
  }

  const {token: jwt} = identityCredential;
  return {jwt};
};
