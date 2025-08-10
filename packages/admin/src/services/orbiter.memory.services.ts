import type {OrbiterParameters} from '@junobuild/ic-client';
import type {MemorySize} from '@junobuild/ic-client/dist/declarations/orbiter/orbiter.did';
import {memorySize} from '../api/orbiter.api';

/**
 * Retrieves the stable and heap memory size of the Orbiter.
 * @param {Object} params - The parameters for the Orbiter.
 * @param {OrbiterParameters} params.orbiter - The Orbiter parameters.
 * @returns {Promise<MemorySize>} A promise that resolves to the memory size of the Orbiter.
 */
export const orbiterMemorySize = (params: {orbiter: OrbiterParameters}): Promise<MemorySize> =>
  memorySize(params);
