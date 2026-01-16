import type {OpenIdProvider} from './provider';
import type {GitHubAuthScope} from './provider.github';
import type {RequestJwt} from './request';

export type RequestGitHubJwtRedirect = RequestJwt &
  Partial<Pick<OpenIdProvider, 'redirectUrl'>> & {
    authScopes: GitHubAuthScope[];
  };

export interface RequestGitHubJwtRedirectParams {
  redirect: RequestGitHubJwtRedirect;
}
