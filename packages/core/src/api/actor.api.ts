import type {ActorSubclass} from '@dfinity/agent';
import type {ActorMethod} from '@dfinity/agent/lib/esm/actor';
import type {IDL} from '@dfinity/candid';
import {assertNonNullish} from '@junobuild/utils';
import type {_SERVICE as SatelliteActor} from '../../declarations/satellite/satellite.did';
import {idlFactory as stockIdlFactory} from '../../declarations/satellite/satellite.factory.did.js';
import {ActorStore} from '../stores/actor.store';
import type {Satellite} from '../types/satellite.types';
import {customOrEnvContainer, customOrEnvSatelliteId} from '../utils/env.utils';

export const getSatelliteActor = async (satellite: Satellite): Promise<SatelliteActor> => {
  return getActor({
    idlFactory: stockIdlFactory,
    ...satellite
  });
};

export const getSatelliteExtendedActor = async <T = Record<string, ActorMethod>>({
  idlFactory,
  ...rest
}: Satellite & {idlFactory: IDL.InterfaceFactory}): Promise<ActorSubclass<T>> => {
  return getActor({
    idlFactory,
    ...rest
  });
};

const getActor = async <T = Record<string, ActorMethod>>({
  satelliteId: customSatelliteId,
  container: customContainer,
  idlFactory,
  ...rest
}: Satellite & {idlFactory: IDL.InterfaceFactory}): Promise<ActorSubclass<T>> => {
  const {satelliteId} = customOrEnvSatelliteId({satelliteId: customSatelliteId});

  assertNonNullish(satelliteId, 'No satellite ID defined. Did you initialize Juno?');

  const {container} = customOrEnvContainer({container: customContainer});

  return await ActorStore.getInstance().getActor({
    satelliteId,
    container,
    idlFactory,
    ...rest
  });
};
