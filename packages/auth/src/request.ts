import {GITHUB_PROVIDER, GOOGLE_PROVIDER} from './_constants';
import {initContext} from './_context';
import {buildGenerateState} from './providers/github/_context';
import {requestGitHubJwtWithRedirect} from './providers/github/_openid';
import type {RequestGitHubJwtRedirectParams} from './providers/github/types/request';
import {generateGoogleState} from './providers/google/_context';
import {
  requestGoogleJwtWithCredentials,
  requestGoogleJwtWithRedirect
} from './providers/google/_openid';
import type {
  RequestGoogleJwtCredentialsParams,
  RequestGoogleJwtParams,
  RequestGoogleJwtRedirectParams
} from './providers/google/types/request';
import type {RequestJwtCredentialsResult} from './types/request';

export function requestJwt(args: {
  google: RequestGoogleJwtCredentialsParams;
}): Promise<RequestJwtCredentialsResult>;

export function requestJwt(
  args: {google: RequestGoogleJwtRedirectParams} | {github: RequestGitHubJwtRedirectParams}
): Promise<void>;

export async function requestJwt(
  args:
    | {
        google: RequestGoogleJwtParams;
      }
    | {github: RequestGitHubJwtRedirectParams}
): Promise<RequestJwtCredentialsResult | void> {
  if ('github' in args) {
    const {github} = args;

    const {redirect} = github;
    const {initUrl: userInitUrl, ...restRedirect} = redirect;

    const {authUrl, authScopes, initUrl} = GITHUB_PROVIDER;

    const context = await initContext({
      generateState: buildGenerateState({initUrl: userInitUrl ?? initUrl})
    });

    requestGitHubJwtWithRedirect({
      ...restRedirect,
      ...context,
      authUrl,
      authScopes
    });
    return;
  }

  const context = await initContext({generateState: generateGoogleState});

  const {google} = args;

  if ('credentials' in google) {
    const {credentials} = google;
    const {configUrl} = GOOGLE_PROVIDER;

    return await requestGoogleJwtWithCredentials({
      ...credentials,
      ...context,
      configUrl
    });
  }

  const {redirect} = google;
  const {authUrl, authScopes} = GOOGLE_PROVIDER;

  requestGoogleJwtWithRedirect({
    ...redirect,
    ...context,
    authUrl,
    authScopes
  });
}
