import type {ActorSubclass} from '@dfinity/agent';
import type {ActorMethod} from '@dfinity/agent/lib/esm/actor';
import type {IDL} from '@dfinity/candid';
import {assertNonNullish} from '@junobuild/utils';
import type {_SERVICE as SatelliteActor} from '../../declarations/satellite/satellite.did';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as stockIdlFactory} from '../../declarations/satellite/satellite.factory.did.js';
import {ActorStore} from '../stores/actor.store';
import type {BuildType} from '../types/build.types';
import type {Satellite} from '../types/satellite.types';
import {customOrEnvContainer, customOrEnvSatelliteId} from '../utils/env.utils';

export const getSatelliteActor = (satellite: Satellite): Promise<SatelliteActor> =>
  getActor({
    idlFactory: stockIdlFactory,
    buildType: 'stock',
    ...satellite
  });

export const getSatelliteExtendedActor = <T = Record<string, ActorMethod>>({
  idlFactory,
  ...rest
}: Satellite & {idlFactory: IDL.InterfaceFactory}): Promise<ActorSubclass<T>> =>
  getActor({
    idlFactory,
    buildType: 'extended',
    ...rest
  });

const getActor = async <T = Record<string, ActorMethod>>({
  satelliteId: customSatelliteId,
  container: customContainer,
  ...rest
}: Satellite & {idlFactory: IDL.InterfaceFactory; buildType: BuildType}): Promise<
  ActorSubclass<T>
> => {
  const {satelliteId} = customOrEnvSatelliteId({satelliteId: customSatelliteId});

  assertNonNullish(satelliteId, 'No satellite ID defined. Did you initialize Juno?');

  const {container} = customOrEnvContainer({container: customContainer});

  return await ActorStore.getInstance().getActor({
    satelliteId,
    container,
    ...rest
  });
};
