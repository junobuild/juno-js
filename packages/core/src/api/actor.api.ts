import type {ActorMethod, ActorSubclass} from '@dfinity/agent';
import type {IDL} from '@dfinity/candid';
import {assertNonNullish} from '@dfinity/utils';
import {ActorStore} from '../stores/actor.store';
import type {BuildType} from '../types/build';
import type {SatelliteContext} from '../types/satellite';
import {customOrEnvContainer, customOrEnvSatelliteId} from '../utils/env.utils';
import {idlFactorySatellite, type SatelliteActor} from './_actor.factory';

export const getSatelliteActor = ({
  satellite
}: {
  satellite: SatelliteContext;
}): Promise<SatelliteActor> =>
  getActor({
    idlFactory: idlFactorySatellite,
    buildType: 'stock',
    ...satellite
  });

export const getSatelliteExtendedActor = <T = Record<string, ActorMethod>>({
  idlFactory,
  ...rest
}: SatelliteContext & {idlFactory: IDL.InterfaceFactory}): Promise<ActorSubclass<T>> =>
  getActor({
    idlFactory,
    buildType: 'extended',
    ...rest
  });

const getActor = async <T = Record<string, ActorMethod>>({
  satelliteId: customSatelliteId,
  container: customContainer,
  ...rest
}: SatelliteContext & {idlFactory: IDL.InterfaceFactory; buildType: BuildType}): Promise<
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
