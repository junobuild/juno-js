import type {OpenIdAuthContext} from './context';
import type {Nonce} from './nonce';
import type {OpenIdProvider} from './provider';
import type {RequestGoogleJwtCredentials, RequestGoogleJwtRedirect} from './request.google';

interface RequestOpenIdJwt {
  nonce: Nonce;
}

export type RequestGoogleJwtWithRedirect = RequestOpenIdJwt &
  Pick<OpenIdAuthContext, 'state'> &
  RequestGoogleJwtRedirect &
  Pick<OpenIdProvider, 'clientId' | 'authUrl' | 'authScopes'> &
  Partial<Pick<OpenIdProvider, 'redirectUrl'>>;

export type RequestGoogleJwtWithCredentials = RequestOpenIdJwt &
  RequestGoogleJwtCredentials &
  Pick<OpenIdProvider, 'clientId' | 'configUrl'>;
