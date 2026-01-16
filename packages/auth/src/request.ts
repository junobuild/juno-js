import {GITHUB_PROVIDER, GOOGLE_PROVIDER} from './_constants';
import {initContext} from './_context';
import {buildGenerateState} from './_context.github';
import {generateState} from './_context.google';
import {requestGitHubJwtWithRedirect} from './_openid.github';
import {requestGoogleJwtWithCredentials, requestGoogleJwtWithRedirect} from './_openid.google';
import {RequestJwtCredentialsResult} from './types/request';
import {RequestGitHubJwtRedirectParams} from './types/request.github';
import type {
  RequestGoogleJwtCredentialsParams,
  RequestGoogleJwtParams,
  RequestGoogleJwtRedirectParams
} from './types/request.google';

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
    const {authUrl, authScopes, initStateUrl} = GITHUB_PROVIDER;

    const context = await initContext({generateState: buildGenerateState({initStateUrl})});

    requestGitHubJwtWithRedirect({
      ...redirect,
      ...context,
      authUrl,
      authScopes
    });
    return;
  }

  const context = await initContext({generateState});

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
