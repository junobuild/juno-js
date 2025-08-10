import type {SatelliteParameters} from '@junobuild/ic-client';
import type {MemorySize} from '@junobuild/ic-client/dist/declarations/satellite/satellite.did';
import {memorySize} from '../api/satellite.api';

/**
 * Retrieves the stable and heap memory size of a satellite.
 * @param {Object} params - The parameters for retrieving the memory size.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<MemorySize>} A promise that resolves to the memory size of the satellite.
 */
export const satelliteMemorySize = (params: {
  satellite: SatelliteParameters;
}): Promise<MemorySize> => memorySize(params);
