import type {OpenIdGitHubProvider} from './providers/github/types/provider';
import type {OpenIdProvider} from './types/provider';

export const CONTEXT_KEY = 'juno:auth:openid';

// Create client_id: https://developers.google.com/identity/openid-connect/openid-connect#authenticationuriparameters
export const GOOGLE_PROVIDER: Omit<OpenIdProvider, 'clientId' | 'redirectUrl'> = {
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  authScopes: ['openid', 'profile', 'email'],
  configUrl: 'https://accounts.google.com/gsi/fedcm.json'
};

export const GITHUB_PROVIDER: Omit<OpenIdGitHubProvider, 'clientId' | 'redirectUrl'> = {
  authUrl: 'https://github.com/login/oauth/authorize',
  authScopes: ['read:user', 'repo'],
  initUrl: 'https://api.juno.build/v1/auth/init/github',
  finalizeUrl: 'https://api.juno.build/v1/auth/finalize/github'
};
