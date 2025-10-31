import {Ed25519KeyIdentity} from '@dfinity/identity';
import {uint8ArrayToBase64} from '@dfinity/utils';
import {SESSION_KEY_CALLER, SESSION_KEY_SALT, SESSION_KEY_STATE} from './_constants';
import {Nonce} from './types/nonce';
import {generateNonce} from './utils/auth.utils';
import {generateRandomState} from './utils/state.utils';

export const initSession = async (): Promise<{nonce: Nonce; state: string}> => {
  const caller = Ed25519KeyIdentity.generate();
  const {nonce, salt} = await generateNonce({caller});
  const state = generateRandomState();

  sessionStorage.setItem(SESSION_KEY_CALLER, JSON.stringify(caller.toJSON()));
  sessionStorage.setItem(SESSION_KEY_SALT, uint8ArrayToBase64(salt));
  sessionStorage.setItem(SESSION_KEY_STATE, state);

  return {
    nonce,
    state
  };
};
