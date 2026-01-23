import {isNullish, nonNullish, notEmptyString} from '@dfinity/utils';
import {authenticate} from '@junobuild/auth';
import {EnvStore} from '../../core/stores/env.store';
import {fromDoc} from '../../datastore/utils/doc.utils';
import {AuthClientStore} from '../stores/auth-client.store';
import type {HandleRedirectCallbackOptions} from '../types/auth';
import {SignInInitError} from '../types/errors';
import type {UserData} from '../types/user';
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

  const finalizeUrl =
    'github' in options && notEmptyString(options?.github?.options?.finalizeUrl)
      ? options.github.options.finalizeUrl
      : null;

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
