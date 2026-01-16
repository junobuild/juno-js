import {isEmptyString} from '@dfinity/utils';
import {loadContext} from './_context';
import {authenticateSession} from './_session';
import {
  AuthenticationInvalidStateError,
  AuthenticationUndefinedJwtError,
  AuthenticationUrlHashError
} from './errors';
import type {
  AuthenticatedSession,
  AuthenticationParams,
  AuthParameters
} from './types/authenticate';
import {AuthenticationGitHubRedirect} from './types/authenticate.github';
import type {OpenIdAuthContext} from './types/context';

export const authenticate = async <T extends AuthParameters>(
  params: AuthenticationParams<T>
): Promise<AuthenticatedSession<T>> => {
  const context = loadContext();

  if ('github' in params) {
    const {github} = params;
    return await authenticateGitHubWithRedirect<T>({...github, context});
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

const authenticateGoogleWithRedirect = async <T extends AuthParameters>({
  auth,
  context
}: {
  auth: AuthParameters;
  context: OpenIdAuthContext;
}): Promise<AuthenticatedSession<T>> => {
  const {
    location: {hash}
  } = window;

  if (isEmptyString(hash) || !hash.startsWith('#')) {
    throw new AuthenticationUrlHashError('No hash found in the current location URL');
  }

  const params = new URLSearchParams(hash.slice(1));
  const state = params.get('state');
  const idToken = params.get('id_token');

  const {state: savedState} = context;

  if (isEmptyString(savedState) || state !== savedState) {
    throw new AuthenticationInvalidStateError('The provided state is invalid', {cause: state});
  }

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
