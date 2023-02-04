import type {_SERVICE as SatelliteActor} from '../../../declarations/satellite/satellite.did';
import {idlFactory} from '../../../declarations/satellite/satellite.factory.did.js';
import {EnvStore} from '../stores/env.store';
import type {Satellite} from '../types/satellite.types';
import {createActor} from '../utils/actor.utils';

export const getSatelliteActor = async ({
  satelliteId,
  ...rest
}: Satellite): Promise<SatelliteActor> => {
  const {satelliteId: canisterId} =
    satelliteId !== undefined
      ? {satelliteId}
      : EnvStore.getInstance().get() ?? {satelliteId: undefined};

  if (!canisterId) {
    throw new Error('No satellite principal defined.');
  }

  return createActor({
    satelliteId: canisterId,
    idlFactory,
    ...rest
  });
};
