// https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
import {OpenIdProvider} from './provider';

export type GitHubAuthScope = 'read:user' | 'repo';

export interface OpenIdGitHubProvider extends Omit<OpenIdProvider, 'authScopes' | 'configUrl'> {
  // OAuth authentication scope
  authScopes: GitHubAuthScope[];
  // Init Url use to generate state and nonce from proxy
  initStateUrl: string;
}
