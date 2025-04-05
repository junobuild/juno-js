import {Principal} from '@dfinity/principal';
import {isNullish} from '@dfinity/utils';
import {type JunoPackage, JunoPackageSchema} from '@junobuild/config';
import {canisterMetadata} from '../api/ic.api';
import {ActorParameters} from '../types/actor.types';

export const getJunoPackage = async ({
  moduleId,
  ...rest
}: {moduleId: Principal | string} & ActorParameters): Promise<JunoPackage | undefined> => {
  const status = await canisterMetadata({...rest, canisterId: moduleId, path: 'juno:package'});

  if (isNullish(status)) {
    return undefined;
  }

  const {success, data} = JunoPackageSchema.safeParse(status);

  if (!success) {
    return undefined;
  }

  return data;
};
