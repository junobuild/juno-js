import {GOOGLE_PROVIDER} from './_constants';
import {initContext} from './_context';
import {requestJwtWithRedirect, requestWithCredentials} from './_openid';
import type {RequestJwtParams} from './types/request';

export const requestJwt = async ({google}: {google: RequestJwtParams}): Promise<{jwt: string}> => {
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

  throw new Error('Unreachable');
};
