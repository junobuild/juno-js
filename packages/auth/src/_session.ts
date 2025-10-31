import {Ed25519KeyIdentity} from '@dfinity/identity';
import {SESSION_KEY} from './_constants';
import {Nonce} from './types/nonce';
import {SessionData} from './types/session';
import {generateNonce} from './utils/auth.utils';
import {stringifySessionData} from './utils/session.utils';
import {generateRandomState} from './utils/state.utils';

export const initSession = async (): Promise<{nonce: Nonce} & Pick<SessionData, 'state'>> => {
  const caller = Ed25519KeyIdentity.generate();
  const {nonce, salt} = await generateNonce({caller});
  const state = generateRandomState();

  const storedData = stringifySessionData({
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
