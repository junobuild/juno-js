import {Ed25519KeyIdentity} from '@icp-sdk/core/identity';
import type {Nonce, Salt} from '../types/nonce';
import {generateNonce} from '../utils/nonce.utils';

export const initContext = async (): Promise<{
  nonce: Nonce;
  salt: Salt;
  caller: Ed25519KeyIdentity;
}> => {
  const caller = Ed25519KeyIdentity.generate();
  const {nonce, salt} = await generateNonce({caller});

  return {
    nonce,
    salt,
    caller
  };
};
