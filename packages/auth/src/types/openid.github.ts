import type {OpenIdAuthContext} from './context';
import type {OpenIdProvider} from './provider';
import {OpenIdGitHubProvider} from './provider.github';
import {RequestGitHubJwtRedirect} from './request.github';

export type RequestGitHubJwtWithRedirect = Pick<OpenIdAuthContext, 'state'> &
  RequestGitHubJwtRedirect &
  Omit<OpenIdGitHubProvider, 'redirectUrl' | 'initStateUrl'> &
  Partial<Pick<OpenIdProvider, 'redirectUrl'>>;
