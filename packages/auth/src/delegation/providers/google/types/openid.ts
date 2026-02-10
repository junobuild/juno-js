import type {Nonce} from '../../../../types/nonce';
import type {OpenIdAuthContext} from '../../../types/context';
import type {OpenIdProvider} from '../../../types/provider';
import type {RequestGoogleJwtCredentials, RequestGoogleJwtRedirect} from './request';

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
