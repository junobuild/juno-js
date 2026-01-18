import {isEmptyString} from '@dfinity/utils';
import {authenticateSession} from '../../_session';
import {AuthenticationUndefinedJwtError} from '../../errors';
import type {AuthenticatedSession, AuthParameters} from '../../types/authenticate';
import type {OpenIdAuthContext} from '../../types/context';
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
