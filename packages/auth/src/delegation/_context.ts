import {isNullish} from '@dfinity/utils';
import {Ed25519KeyIdentity} from '@icp-sdk/core/identity';
import {CONTEXT_KEY} from './_constants';
import {ContextUndefinedError} from './errors';
import type {OpenIdAuthContext} from './types/context';
import type {Nonce} from './types/nonce';
import {generateNonce} from './utils/auth.utils';
import {parseContext, stringifyContext} from './utils/session-storage.utils';

export const initContext = async ({
  generateState
}: {
  generateState: (params: {nonce: Nonce}) => Promise<string>;
}): Promise<{nonce: Nonce} & Pick<OpenIdAuthContext, 'state'>> => {
  const caller = Ed25519KeyIdentity.generate();
  const {nonce, salt} = await generateNonce({caller});

  const state = await generateState({nonce});

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
