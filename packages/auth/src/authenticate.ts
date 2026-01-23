import {GITHUB_PROVIDER} from './_constants';
import {loadContext} from './_context';
import {authenticateSession} from './_session';
import {authenticateGitHubWithRedirect} from './providers/github/authenticate';
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
