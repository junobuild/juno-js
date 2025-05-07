import type {CanisterStatusResponse} from '@dfinity/ic-management';
import {Principal} from '@dfinity/principal';
import {assertNonNullish} from '@dfinity/utils';
import {canisterStatus} from '../api/ic.api';
import type {SatelliteParameters} from '../types/actor.types';

/**
 * Retrieves the memory size of a satellite.
 * @param {Object} params - The parameters for retrieving the memory size.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<Pick<CanisterStatusResponse, 'memory_size' | 'memory_metrics'>>} A promise that resolves to the memory size of the satellite.
 */
export const satelliteMemorySize = async ({
  satellite
}: {
  satellite: SatelliteParameters;
}): Promise<Pick<CanisterStatusResponse, 'memory_size' | 'memory_metrics'>> => {
  const {satelliteId, ...actor} = satellite;

  assertNonNullish(satelliteId, 'No Satellite ID provided.');

  const {memory_size, memory_metrics} = await canisterStatus({
    actor,
    canisterId: Principal.fromText(satelliteId)
  });

  return {memory_size, memory_metrics};
};
