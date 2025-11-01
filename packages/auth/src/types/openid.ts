import type {OpenIdAuthContext} from './context';
import type {Nonce} from './nonce';
import type {OpenIdProvider} from './provider';
import type {RequestJwtCredentials, RequestJwtRedirect} from './request';

interface RequestOpenIdJwt {
  nonce: Nonce;
}

export type RequestJwtWithRedirect = RequestOpenIdJwt &
  Pick<OpenIdAuthContext, 'state'> &
  RequestJwtRedirect &
  Pick<OpenIdProvider, 'clientId' | 'authUrl' | 'authScopes'> &
  Partial<Pick<OpenIdProvider, 'redirectUrl'>>;

export type RequestJwtWithCredentials = RequestOpenIdJwt &
  RequestJwtCredentials &
  Pick<OpenIdProvider, 'clientId' | 'configUrl'>;
