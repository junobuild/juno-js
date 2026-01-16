import type {OpenIdProvider} from './provider';
import {OpenIdGitHubProvider} from './provider.github';
import type {RequestJwt} from './request';

export type RequestGitHubJwtRedirect = RequestJwt &
  Partial<Pick<OpenIdProvider, 'redirectUrl'>> &
  Partial<Pick<OpenIdGitHubProvider, 'authScopes' | 'initUrl'>>;

export interface RequestGitHubJwtRedirectParams {
  redirect: RequestGitHubJwtRedirect;
}
