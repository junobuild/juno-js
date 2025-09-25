import {AnonymousIdentity, type Identity} from '@icp-sdk/core/agent';
import {nonNullish} from '@dfinity/utils';
import {getIdentity as getAuthIdentity} from '../../auth/services/auth.services';

export const getAnyIdentity = (identity?: Identity): Identity => {
  if (nonNullish(identity)) {
    return identity;
  }

  return getAuthIdentity() ?? new AnonymousIdentity();
};
