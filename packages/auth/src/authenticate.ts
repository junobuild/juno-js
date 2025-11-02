import {isEmptyString} from '@dfinity/utils';
import {loadContext} from './_context';
import {authenticate as authenticateSession} from './_session';
import {
  AuthenticationInvalidStateError,
  AuthenticationUndefinedJwtError,
  AuthenticationUrlHashError
} from './errors';
import type {AuthParameters} from './types/actor';
import type {AuthenticatedIdentity, AuthenticationParams} from './types/authenticate';
import type {OpenIdAuthContext} from './types/context';

export const authenticate = async (
  params: AuthenticationParams
): Promise<AuthenticatedIdentity> => {
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

  return await authenticateWithRedirect({...params, context});
};

const authenticateWithRedirect = async ({
  auth,
  context
}: {
  auth: AuthParameters;
  context: OpenIdAuthContext;
}): Promise<AuthenticatedIdentity> => {
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
