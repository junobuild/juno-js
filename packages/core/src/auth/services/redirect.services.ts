import {isNullish} from '@dfinity/utils';
import {authenticate as authenticateApi} from '@junobuild/auth';
import {EnvStore} from '../../core/stores/env.store';
import {fromDoc} from '../../datastore/utils/doc.utils';
import {executeWithWindowGuard} from '../helpers/window.helpers';
import {AuthClientStore} from '../stores/auth-client.store';
import type {SignInContext} from '../types/auth';
import {SignInInitError} from '../types/errors';
import type {UserData} from '../types/user';
import {loadAuthWithUser} from './load.services';

export const handleRedirectCallback = async ({context}: {context?: SignInContext} = {}) => {
  const disableWindowGuard = context?.windowGuard === false;

  if (disableWindowGuard) {
    await authenticate();
    return;
  }

  await executeWithWindowGuard({fn: authenticate});
};

const authenticate = async () => {
  const {satelliteId} = EnvStore.getInstance().get() ?? {satelliteId: undefined};

  if (isNullish(satelliteId)) {
    throw new SignInInitError('Satellite ID not set. Have you initialized the Satellite?');
  }

  const container = EnvStore.getInstance().get()?.container;

  const {
    identity: {delegationChain, sessionKey, identity},
    data: {doc}
  } = await authenticateApi({
    redirect: null,
    auth: {
      satellite: {
        satelliteId,
        container
      }
    }
  });

  // Set up the delegation and session key for the AuthClient
  await AuthClientStore.getInstance().setAuthClientStorage({
    delegationChain,
    sessionKey
  });

  // Create the AuthClient, load the identity and set the user in store
  const user = await fromDoc<UserData>({doc, key: identity.getPrincipal().toText()});
  await loadAuthWithUser({user});
};
