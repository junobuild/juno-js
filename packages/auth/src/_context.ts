import {Ed25519KeyIdentity} from '@dfinity/identity';
import {isNullish} from '@dfinity/utils';
import {CONTEXT_KEY} from './_constants';
import {ContextUndefinedError} from './errors';
import type {OpenIdAuthContext} from './types/context';
import type {Nonce} from './types/nonce';
import {generateNonce} from './utils/auth.utils';
import {parseContext, stringifyContext} from './utils/session-storage.utils';
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

  sessionStorage.setItem(CONTEXT_KEY, storedData);

  return {
    nonce,
    state
  };
};

export const loadContext = (): OpenIdAuthContext => {
  const storedContext = sessionStorage.getItem(CONTEXT_KEY);

  if (isNullish(storedContext)) {
    throw new ContextUndefinedError();
  }

  return parseContext(storedContext);
};
