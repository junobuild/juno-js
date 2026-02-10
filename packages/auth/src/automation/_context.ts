import {Ed25519KeyIdentity} from '@icp-sdk/core/identity';
import {generateNonce} from '../utils/nonce.utils';
import type {OpenIdAutomationContext} from './types/context';

export const initContext = async (): Promise<OpenIdAutomationContext> => {
  const caller = Ed25519KeyIdentity.generate();
  const {nonce, salt} = await generateNonce({caller});

  return {
    nonce,
    salt,
    caller
  };
};
