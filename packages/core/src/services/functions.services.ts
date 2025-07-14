import type {ActorSubclass} from '@dfinity/agent';
import type {ActorMethod} from '@dfinity/agent/lib/esm/actor';
import type {IDL} from '@dfinity/candid';
import {getSatelliteExtendedActor as getSatelliteExtendedActorApi} from '../api/actor.api';
import type {SatelliteOptions} from '../types/satellite';
import {getAnyIdentity} from './_identity.services';

/**
 * Returns an extended satellite actor instance using the provided IDL factory and satellite options.
 *
 * This function is intended for advanced use cases where developers have implemented
 * custom endpoints in their serverless functions using the extended build type.
 *
 * In most cases, developers should not need to call this directly.
 * Extended actors are typically mapped and handled automatically.
 *
 * @template T - The actor interface type.
 *
 * @param {Object} params - The parameters for creating the actor.
 * @param {IDL.InterfaceFactory} params.idlFactory - The IDL factory defining the custom actor interface.
 * @param {SatelliteOptions} [params.satellite] - Options to specify a satellite in a NodeJS environment only.
 * In browser environments, configuration is automatically inherited from `initSatellite()`.
 *
 * @returns {Promise<ActorSubclass<T>>} A promise that resolves to the extended actor instance.
 */
export const getSatelliteExtendedActor = async <T = Record<string, ActorMethod>>({
  idlFactory,
  satellite
}: {
  idlFactory: IDL.InterfaceFactory;
  satellite?: SatelliteOptions;
}): Promise<ActorSubclass<T>> => {
  const identity = getAnyIdentity(satellite?.identity);

  return await getSatelliteExtendedActorApi({
    idlFactory,
    ...satellite,
    identity
  });
};
