import {loadContext} from './_context';
import {authenticateSession} from './_session';
import {authenticateGoogleWithRedirect} from './providers/google/authenticate';
import type {
  AuthenticatedSession,
  AuthenticationParams,
  AuthParameters
} from './types/authenticate';

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
