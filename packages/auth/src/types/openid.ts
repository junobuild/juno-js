import type {OpenIdAuthContext} from './context';
import type {Nonce} from './nonce';

export type AuthScope = 'openid' | 'profile' | 'email';

export interface IdentityProvider {
  // OAuth client ID
  clientId: string;
  // OAuth authentication URL
  authUrl: string;
  // OAuth authentication scope
  authScopes: AuthScope[];
  // Optional, FedCM config URL
  configUrl: string;
  // Determines where the API server redirects the user after the user completes the authorization flow.
  redirectUrl: string;
}

type RequestJwt = Pick<OpenIdAuthContext, 'state'> & {
  nonce: Nonce;
};

// https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient
type RequestJwtRedirect = RequestJwt & {
  // If your application knows which user is trying to authenticate, it can use this parameter to provide a hint to the Google Authentication Server.
  // The server uses the hint to simplify the login flow either by prefilling the email field in the sign-in form or by selecting the appropriate multi-login session.
  // Set the parameter value to an email address or sub identifier, which is equivalent to the user's Google ID
  loginHint?: string;
};

// https://www.w3.org/TR/fedcm/#browser-api-credential-request-options
type RequestJwtCredentials = RequestJwt & {
  // A string representing the login hint corresponding to an account which the RP wants the user agent to show to the user. If provided, the user agent will not show accounts which do not match this login hint value.
  // If provided, the user agent will not show accounts which do not match this login hint value.
  loginHint?: string;
  // A string representing the domain hint corresponding to a domain which the RP is interested in, or "any" if the RP wants any account associated with at least one domain hint.
  // If provided, the user agent will not show accounts which do not match the domain hint value.
  domainHint?: string | 'any';
};

export type RequestJwtWithRedirect = RequestJwtRedirect &
  Pick<IdentityProvider, 'clientId' | 'authUrl' | 'authScopes' | 'redirectUrl'>;

export type RequestJwtWithCredentials = RequestJwtCredentials &
  Pick<IdentityProvider, 'clientId' | 'configUrl'>;
