export type AuthScope = 'openid' | 'profile' | 'email';

export interface OpenIdProvider {
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
