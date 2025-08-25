import type {SatelliteDid, SatelliteParameters} from '@junobuild/ic-client/actor';
import {memorySize} from '../api/satellite.api';

/**
 * Retrieves the stable and heap memory size of a satellite.
 * @param {Object} params - The parameters for retrieving the memory size.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<MemorySize>} A promise that resolves to the memory size of the satellite.
 */
export const satelliteMemorySize = (params: {
  satellite: SatelliteParameters;
}): Promise<SatelliteDid.MemorySize> => memorySize(params);
