import type {OpenIdProvider} from '../../../types/provider';
import type {RequestJwt} from '../../../types/request';
import type {OpenIdGitHubProvider} from './provider';

export type RequestGitHubJwtRedirect = RequestJwt &
  Partial<Pick<OpenIdProvider, 'redirectUrl'>> &
  Partial<Pick<OpenIdGitHubProvider, 'authScopes' | 'initUrl'>>;

export interface RequestGitHubJwtRedirectParams {
  redirect: RequestGitHubJwtRedirect;
}
