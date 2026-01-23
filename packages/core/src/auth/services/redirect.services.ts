import {isEmptyString, isNullish, nonNullish, notEmptyString} from '@dfinity/utils';
import {authenticate} from '@junobuild/auth';
import {EnvStore} from '../../core/stores/env.store';
import {envApiUrl} from '../../core/utils/window.env.utils';
import {fromDoc} from '../../datastore/utils/doc.utils';
import {AuthClientStore} from '../stores/auth-client.store';
import type {HandleRedirectCallbackOptions} from '../types/auth';
import {SignInInitError} from '../types/errors';
import type {UserData} from '../types/user';
import {parseOptionalUrl} from '../utils/url.utils';
import {loadAuthWithUser} from './load.services';

export const handleRedirectCallback = async (options: HandleRedirectCallbackOptions) => {
  const {satelliteId} = EnvStore.getInstance().get() ?? {satelliteId: undefined};

  if (isNullish(satelliteId)) {
    throw new SignInInitError('Satellite ID not set. Have you initialized the Satellite?');
  }

  const container = EnvStore.getInstance().get()?.container;

  const auth = {
    auth: {
      satellite: {
        satelliteId,
        container
      }
    }
  };

  const buildFinalizeUrl = (): string | null => {
    const finalizeUrl = 'github' in options ? options?.github?.options?.finalizeUrl : undefined;

    if (notEmptyString(finalizeUrl)) {
      return finalizeUrl;
    }

    const apiUrl = envApiUrl();

    if (isEmptyString(apiUrl)) {
      return null;
    }

    return parseOptionalUrl({url: `${apiUrl}/v1/auth/finalize/github`})?.toString() ?? null;
  };

  const finalizeUrl = buildFinalizeUrl();

  const {
    identity: {delegationChain, sessionKey, identity},
    data: {doc}
  } = await authenticate(
    'github' in options
      ? {
          github: {
            redirect: nonNullish(finalizeUrl) ? {finalizeUrl} : null,
            ...auth
          }
        }
      : {
          google: {
            redirect: null,
            ...auth
          }
        }
  );

  // Set up the delegation and session key for the AuthClient
  await AuthClientStore.getInstance().setAuthClientStorage({
    delegationChain,
    sessionKey
  });

  // Create the AuthClient, load the identity and set the user in store
  const user = await fromDoc<UserData>({doc, key: identity.getPrincipal().toText()});
  await loadAuthWithUser({user});
};
