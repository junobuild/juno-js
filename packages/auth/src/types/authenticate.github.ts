import {OpenIdGitHubProvider} from './provider.github';

export type AuthenticationGitHubRedirect = Partial<Pick<OpenIdGitHubProvider, 'finalizeUrl'>>;
