import {isNullish} from '@dfinity/utils';
import {authenticate} from '@junobuild/auth';
import {EnvStore} from '../../core/stores/env.store';
import {SignInInitError} from '../types/errors';

export const handleRedirectCallback = async () => {
  const {satelliteId} = EnvStore.getInstance().get() ?? {satelliteId: undefined};

  if (isNullish(satelliteId)) {
    throw new SignInInitError('Satellite ID not set. Have you initialized the Satellite?');
  }

  const container = EnvStore.getInstance().get()?.container;

  const {
    identity: {delegationChain, sessionKey, identity},
    data
  } = await authenticate({
    redirect: null,
    auth: {
      satellite: {
        satelliteId,
        container
      }
    }
  });

  console.log(data.doc);
};
