// https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
import type {OpenIdProvider} from '../../../types/provider';

export type GitHubAuthScope = 'read:user' | 'repo';

export interface OpenIdGitHubProvider extends Omit<OpenIdProvider, 'authScopes' | 'configUrl'> {
  // OAuth authentication scope
  authScopes: GitHubAuthScope[];
  // Init Url use to generate state and nonce from proxy
  initUrl: string;
  // The Url to finalize the OAuth process with the proxy and get a JWT token
  finalizeUrl: string;
}
