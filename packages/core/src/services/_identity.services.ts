import {AnonymousIdentity, type Identity} from '@dfinity/agent';
import {nonNullish} from '@dfinity/utils';
import {getIdentity as getAuthIdentity} from './auth.services';

export const getAnyIdentity = (identity?: Identity): Identity => {
  if (nonNullish(identity)) {
    return identity;
  }

  return getAuthIdentity() ?? new AnonymousIdentity();
};
