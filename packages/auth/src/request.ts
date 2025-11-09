import {GOOGLE_PROVIDER} from './_constants';
import {initContext} from './_context';
import {requestJwtWithRedirect, requestWithCredentials} from './_openid';
import type {
  RequestJwtCredentialsParams,
  RequestJwtCredentialsResult,
  RequestJwtParams,
  RequestJwtRedirectParams
} from './types/request';

export function requestJwt(args: {
  google: RequestJwtCredentialsParams;
}): Promise<RequestJwtCredentialsResult>;

export function requestJwt(args: {google: RequestJwtRedirectParams}): Promise<void>;

export async function requestJwt({
  google
}: {
  google: RequestJwtParams;
}): Promise<RequestJwtCredentialsResult | void> {
  const context = await initContext();

  if ('credentials' in google) {
    const {credentials} = google;
    const {configUrl} = GOOGLE_PROVIDER;

    return await requestWithCredentials({
      ...credentials,
      ...context,
      configUrl
    });
  }

  const {redirect} = google;
  const {authUrl, authScopes} = GOOGLE_PROVIDER;

  requestJwtWithRedirect({
    ...redirect,
    ...context,
    authUrl,
    authScopes
  });
}
