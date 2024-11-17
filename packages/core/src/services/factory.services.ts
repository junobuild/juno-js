import type {ActorSubclass} from '@dfinity/agent';
import type {ActorMethod} from '@dfinity/agent/lib/esm/actor';
import type {IDL} from '@dfinity/candid';
import {getSatelliteExtendedActor as getSatelliteExtendedActorApi} from '../api/actor.api';
import type {SatelliteOptions} from '../types/satellite.types';
import {getIdentity} from './identity.services';

export const getSatelliteExtendedActor = async <T = Record<string, ActorMethod>>({
  idlFactory,
  satellite
}: {
  idlFactory: IDL.InterfaceFactory;
  satellite?: SatelliteOptions;
}): Promise<ActorSubclass<T>> => {
  const identity = getIdentity(satellite?.identity);

  return await getSatelliteExtendedActorApi({
    idlFactory,
    ...satellite,
    identity
  });
};
