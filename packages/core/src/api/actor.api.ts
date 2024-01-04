import {nonNullish} from '@junobuild/utils';
import type {_SERVICE as SatelliteActor} from '../../declarations/satellite/satellite.did';
import {idlFactory} from '../../declarations/satellite/satellite.factory.did.js';
import {EnvStore} from '../stores/env.store';
import type {Satellite} from '../types/satellite.types';
import {createActor} from '../utils/actor.utils';

export const getSatelliteActor = async ({
  satelliteId,
  container: customContainer,
  ...rest
}: Satellite): Promise<SatelliteActor> => {
  const {satelliteId: canisterId} = nonNullish(satelliteId)
    ? {satelliteId}
    : EnvStore.getInstance().get() ?? {satelliteId: undefined};

  const {container} = nonNullish(customContainer)
    ? {container: customContainer}
    : EnvStore.getInstance().get() ?? {container: undefined};

  if (!canisterId) {
    throw new Error('No satellite principal defined.');
  }

  return createActor({
    satelliteId: canisterId,
    container,
    idlFactory,
    ...rest
  });
};
