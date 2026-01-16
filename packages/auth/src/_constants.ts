import type {OpenIdProvider} from './types/provider';
import {OpenIdGitHubProvider} from './types/provider.github';

export const CONTEXT_KEY = 'juno:auth:openid';

// Create client_id: https://developers.google.com/identity/openid-connect/openid-connect#authenticationuriparameters
export const GOOGLE_PROVIDER: Omit<OpenIdProvider, 'clientId' | 'redirectUrl'> = {
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  authScopes: ['openid', 'profile', 'email'],
  configUrl: 'https://accounts.google.com/gsi/fedcm.json'
};

export const GITHUB_PROVIDER: Omit<OpenIdGitHubProvider, 'clientId' | 'redirectUrl'> = {
  authUrl: 'http://accounts.google.com/o/o/oauth2/v2/auth',
  authScopes: ['read:user', 'repo'],
  initUrl: 'http://localhost:3000/v1/auth/init/github'
};
