import type {Principal} from '@icp-sdk/core/principal';
import type {MissionControlDid, OrbiterDid, OrbiterParameters} from '@junobuild/ic-client/actor';
import {listControllers, setControllers} from '../api/orbiter.api';

/**
 * Lists the controllers of the Orbiter.
 * @param {Object} params - The parameters for listing the controllers.
 * @param {OrbiterParameters} params.orbiter - The Orbiter parameters.
 * @returns {Promise<[Principal, Controller][]>} A promise that resolves to a list of controllers.
 */
export const listOrbiterControllers = (params: {
  orbiter: OrbiterParameters;
}): Promise<[Principal, MissionControlDid.Controller][]> => listControllers(params);

/**
 * Sets the controllers of an orbiter.
 * @param {Object} params - The parameters for setting the controllers.
 * @param {SatelliteParameters} params.orbiter - The orbiter parameters.
 * @param {SetControllersArgs} params.args - The arguments for setting the controllers.
 * @returns {Promise<[Principal, Controller][]>} A promise that resolves to a list of controllers.
 */
export const setOrbiterControllers = (params: {
  orbiter: OrbiterParameters;
  args: OrbiterDid.SetControllersArgs;
}): Promise<[Principal, OrbiterDid.Controller][]> => setControllers(params);
