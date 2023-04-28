import type {Identity} from '@dfinity/agent';
import {AnonymousIdentity} from '@dfinity/agent';
import {getIdentity as getAuthIdentity} from './auth.services';

export const getIdentity = (identity?: Identity): Identity => {
  if (identity !== undefined) {
    return identity;
  }

  const authIdentity: Identity | undefined = getAuthIdentity();

  return authIdentity ?? new AnonymousIdentity();
};
