import {Ed25519KeyIdentity} from '@dfinity/identity';
import {SESSION_KEY} from './_constants';
import type {OpenIdAuthContext} from './types/context';
import type {Nonce} from './types/nonce';
import {generateNonce} from './utils/auth.utils';
import {stringifyContext} from './utils/session-storage.utils';
import {generateRandomState} from './utils/state.utils';

export const initContext = async (): Promise<{nonce: Nonce} & Pick<OpenIdAuthContext, 'state'>> => {
  const caller = Ed25519KeyIdentity.generate();
  const {nonce, salt} = await generateNonce({caller});
  const state = generateRandomState();

  const storedData = stringifyContext({
    caller,
    salt,
    state
  });

  sessionStorage.setItem(SESSION_KEY, storedData);

  return {
    nonce,
    state
  };
};
