import type {IdentityProvider} from './types/openid';

export const SESSION_KEY = 'juno:auth:openid';

// Create client_id: https://developers.google.com/identity/openid-connect/openid-connect#authenticationuriparameters
export const GOOGLE_PROVIDER: Omit<IdentityProvider, 'clientId' | 'redirectUrl'> = {
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  authScopes: ['openid', 'profile', 'email'],
  configUrl: 'https://accounts.google.com/gsi/fedcm.json'
};
