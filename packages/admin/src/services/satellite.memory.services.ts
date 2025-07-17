import type {MemorySize} from '../../declarations/satellite/satellite.did';
import {memorySize} from '../api/satellite.api';
import type {SatelliteParameters} from '../types/actor';

/**
 * Retrieves the stable and heap memory size of a satellite.
 * @param {Object} params - The parameters for retrieving the memory size.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<MemorySize>} A promise that resolves to the memory size of the satellite.
 */
export const satelliteMemorySize = (params: {
  satellite: SatelliteParameters;
}): Promise<MemorySize> => memorySize(params);
