import {version} from '../api/orbiter.api';
import type {OrbiterParameters} from '../types/actor.types';

/**
 * Retrieves the version of the Orbiter.
 * @param {Object} params - The parameters for the Orbiter.
 * @param {OrbiterParameters} params.orbiter - The Orbiter parameters.
 * @returns {Promise<string>} A promise that resolves to the version of the Orbiter.
 */
export const orbiterVersion = (params: {orbiter: OrbiterParameters}): Promise<string> =>
  version(params);
