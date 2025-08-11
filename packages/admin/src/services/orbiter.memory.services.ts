import type {OrbiterDid, OrbiterParameters} from '@junobuild/ic-client';
import {memorySize} from '../api/orbiter.api';

/**
 * Retrieves the stable and heap memory size of the Orbiter.
 * @param {Object} params - The parameters for the Orbiter.
 * @param {OrbiterParameters} params.orbiter - The Orbiter parameters.
 * @returns {Promise<MemorySize>} A promise that resolves to the memory size of the Orbiter.
 */
export const orbiterMemorySize = (params: {
  orbiter: OrbiterParameters;
}): Promise<OrbiterDid.MemorySize> => memorySize(params);
