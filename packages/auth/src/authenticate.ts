import {isEmptyString} from '@dfinity/utils';
import {GITHUB_PROVIDER} from './_constants';
import {loadContext} from './_context';
import {authenticateSession} from './_session';
import {AuthenticationUndefinedJwtError} from './errors';
import type {AuthenticationGitHubRedirect} from './providers/github/types/authenticate';
import {authenticateGoogleWithRedirect} from './providers/google/authenticate';
import type {
  AuthenticatedSession,
  AuthenticationParams,
  AuthParameters
} from './types/authenticate';
import type {OpenIdAuthContext} from './types/context';

export const authenticate = async <T extends AuthParameters>(
  params: AuthenticationParams<T>
): Promise<AuthenticatedSession<T>> => {
  const context = loadContext();

  if ('github' in params) {
    const {
      github: {redirect, auth}
    } = params;

    const {finalizeUrl} = GITHUB_PROVIDER;

    return await authenticateGitHubWithRedirect<T>({
      redirect: redirect ?? {finalizeUrl},
      auth,
      context
    });
  }

  const {google} = params;

  if ('credentials' in google) {
    const {
      credentials: {jwt},
      auth
    } = google;

    return await authenticateSession({
      jwt,
      context,
      auth
    });
  }

  return await authenticateGoogleWithRedirect<T>({...google, context});
};

const authenticateGitHubWithRedirect = async <T extends AuthParameters>({
  auth,
  context,
  redirect: {finalizeUrl}
}: {
  auth: AuthParameters;
  context: Omit<OpenIdAuthContext, 'state'>;
  redirect: AuthenticationGitHubRedirect;
}): Promise<AuthenticatedSession<T>> => {
  const {
    location: {search}
  } = window;

  const urlParams = new URLSearchParams(search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');

  // TODO: handle error
  const {token: idToken} = await fetch(finalizeUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({code, state})
  }).then((r) => r.json());

  // id_token === jwt
  if (isEmptyString(idToken)) {
    throw new AuthenticationUndefinedJwtError();
  }

  return await authenticateSession({
    jwt: idToken,
    auth,
    context
  });
};
