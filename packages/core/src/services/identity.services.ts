import type {Identity} from '@dfinity/agent';
import {getIdentity as getAuthIdentity} from './auth.services';

export const getIdentity = (identity?: Identity): Identity => {
  if (identity !== undefined) {
    return identity;
  }

  const authIdentity: Identity | undefined = getAuthIdentity();

  if (!authIdentity) {
    throw new Error('No identity to perform call. Have you initialized Juno?');
  }

  return authIdentity;
};
