import type {Principal} from '@dfinity/principal';
import type {OrbiterParameters} from '@junobuild/ic-client';
import type {Controller} from '@junobuild/ic-client/dist/declarations/mission_control/mission_control.did';
import {listControllers} from '../api/orbiter.api';

/**
 * Lists the controllers of the Orbiter.
 * @param {Object} params - The parameters for listing the controllers.
 * @param {OrbiterParameters} params.orbiter - The Orbiter parameters.
 * @returns {Promise<[Principal, Controller][]>} A promise that resolves to a list of controllers.
 */
export const listOrbiterControllers = (params: {
  orbiter: OrbiterParameters;
}): Promise<[Principal, Controller][]> => listControllers(params);
