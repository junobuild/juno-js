import {Principal} from '@dfinity/principal';
import type {Controller} from '../../declarations/mission_control/mission_control.did';
import {listControllers} from '../api/orbiter.api';
import type {OrbiterParameters} from '../types/actor.types';

/**
 * Lists the controllers of the Orbiter.
 * @param {Object} params - The parameters for listing the controllers.
 * @param {OrbiterParameters} params.orbiter - The Orbiter parameters.
 * @returns {Promise<[Principal, Controller][]>} A promise that resolves to a list of controllers.
 */
export const listOrbiterControllers = (params: {
  orbiter: OrbiterParameters;
}): Promise<[Principal, Controller][]> => listControllers(params);
