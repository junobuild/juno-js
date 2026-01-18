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
import type {OpenIdAuthContext} from './types/context';

export const authenticate = async <T extends AuthParameters>(
  params: AuthenticationParams<T>
): Promise<AuthenticatedSession<T>> => {
  const context = loadContext();

  if ('credentials' in params) {
    const {
      credentials: {jwt},
      auth
    } = params;

    return await authenticateSession({
      jwt,
      context,
      auth
    });
  }

  return await authenticateGoogleWithRedirect<T>({...params, context});
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
