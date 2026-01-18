import type {OpenIdGitHubProvider} from './provider';

export type AuthenticationGitHubRedirect = Pick<OpenIdGitHubProvider, 'finalizeUrl'>;
