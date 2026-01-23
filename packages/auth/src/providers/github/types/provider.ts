import type {OpenIdProvider} from '../../../types/provider';

// https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
export type GitHubAuthScope = 'read:user' | 'user:email';

export interface OpenIdGitHubProvider extends Omit<OpenIdProvider, 'authScopes' | 'configUrl'> {
  // OAuth authentication scope
  authScopes: GitHubAuthScope[];
  // Init Url use to generate state and nonce from proxy
  initUrl: string;
  // The Url to finalize the OAuth process with the proxy and get a JWT token
  finalizeUrl: string;
}
