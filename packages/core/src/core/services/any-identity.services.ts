import {AnonymousIdentity, type Identity} from '@icp-sdk/core/agent';
import {nonNullish} from '@junobuild/utils';
import {getIdentity as getAuthIdentity} from '../../auth/services/identity.services';

export const getAnyIdentity = async (identity?: Identity): Promise<Identity> => {
  if (nonNullish(identity)) {
    return identity;
  }

  return (await getAuthIdentity()) ?? new AnonymousIdentity();
};
