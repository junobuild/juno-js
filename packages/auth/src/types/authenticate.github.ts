import {OpenIdGitHubProvider} from './provider.github';

export type AuthenticationGitHubRedirect = Pick<OpenIdGitHubProvider, 'finalizeUrl'>;
