import {assertNonNullish} from '@junobuild/utils';
import type {_SERVICE as SatelliteActor} from '../../declarations/satellite/satellite.did';
import {idlFactory} from '../../declarations/satellite/satellite.factory.did.js';
import type {Satellite} from '../types/satellite.types';
import {createActor} from '../utils/actor.utils';
import {customOrEnvContainer, customOrEnvSatelliteId} from '../utils/env.utils';

export const getSatelliteActor = async ({
  satelliteId: customSatelliteId,
  container: customContainer,
  ...rest
}: Satellite): Promise<SatelliteActor> => {
  const {satelliteId} = customOrEnvSatelliteId({satelliteId: customSatelliteId});

  assertNonNullish(satelliteId, 'No satellite principal defined.');

  const {container} = customOrEnvContainer({container: customContainer});

  return createActor({
    satelliteId,
    container,
    idlFactory,
    ...rest
  });
};
