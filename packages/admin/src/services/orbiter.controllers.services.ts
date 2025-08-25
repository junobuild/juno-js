import type {Principal} from '@dfinity/principal';
import type {MissionControlDid, OrbiterParameters} from '@junobuild/ic-client/actor';
import {listControllers} from '../api/orbiter.api';

/**
 * Lists the controllers of the Orbiter.
 * @param {Object} params - The parameters for listing the controllers.
 * @param {OrbiterParameters} params.orbiter - The Orbiter parameters.
 * @returns {Promise<[Principal, Controller][]>} A promise that resolves to a list of controllers.
 */
export const listOrbiterControllers = (params: {
  orbiter: OrbiterParameters;
}): Promise<[Principal, MissionControlDid.Controller][]> => listControllers(params);
