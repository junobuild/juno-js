import type {OpenIdAuthContext} from '../../../types/context';
import type {OpenIdProvider} from '../../../types/provider';
import type {OpenIdGitHubProvider} from './provider';
import type {RequestGitHubJwtRedirect} from './request';

export type RequestGitHubJwtWithRedirect = Pick<OpenIdAuthContext, 'state'> &
  RequestGitHubJwtRedirect &
  Omit<OpenIdGitHubProvider, 'redirectUrl' | 'initUrl' | 'finalizeUrl'> &
  Partial<Pick<OpenIdProvider, 'redirectUrl'>>;
