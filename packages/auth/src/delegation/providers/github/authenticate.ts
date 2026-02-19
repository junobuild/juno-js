import {isEmptyString} from '@dfinity/utils';
import {authenticateSession} from '../../_session';
import {AuthenticationUndefinedJwtError} from '../../errors';
import type {AuthenticatedSession, AuthParameters} from '../../types/authenticate';
import type {OpenIdAuthContext} from '../../types/context';
import {finalizeOAuth} from './_api';
import type {AuthenticationGitHubRedirect} from './types/authenticate';

export const authenticateGitHubWithRedirect = async <T extends AuthParameters>({
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

  const result = await finalizeOAuth({
    url: finalizeUrl,
    body: {code, state}
  });

  if ('error' in result) {
    throw result.error;
  }

  const {
    success: {token: idToken}
  } = result;

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
