import {GOOGLE_PROVIDER} from './_constants';
import {initContext} from './_context';
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

export function requestJwt(args: {google: RequestGoogleJwtRedirectParams}): Promise<void>;

export async function requestJwt({
  google
}: {
  google: RequestGoogleJwtParams;
}): Promise<RequestJwtCredentialsResult | void> {
  const context = await initContext({generateState: generateGoogleState});

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
