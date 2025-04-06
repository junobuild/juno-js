import type {Principal} from '@dfinity/principal';
import type {Controller, SetControllersArgs} from '../../declarations/satellite/satellite.did';
import {
  listControllers,
  listDeprecatedNoScopeControllers,
  setControllers
} from '../api/satellite.api';
import type {SatelliteParameters} from '../types/actor.types';
/**
 * Lists the controllers of a satellite.
 * @param {Object} params - The parameters for listing the controllers.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @param {boolean} [params.deprecatedNoScope] - Whether to list deprecated no-scope controllers.
 * @returns {Promise<[Principal, Controller][]>} A promise that resolves to a list of controllers.
 */
export const listSatelliteControllers = ({
  deprecatedNoScope,
  ...params
}: {
  satellite: SatelliteParameters;
  deprecatedNoScope?: boolean;
}): Promise<[Principal, Controller][]> => {
  const list = deprecatedNoScope === true ? listDeprecatedNoScopeControllers : listControllers;
  return list(params);
};

/**
 * Sets the controllers of a satellite.
 * @param {Object} params - The parameters for setting the controllers.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @param {SetControllersArgs} params.args - The arguments for setting the controllers.
 * @returns {Promise<[Principal, Controller][]>} A promise that resolves to a list of controllers.
 */
export const setSatelliteControllers = (params: {
  satellite: SatelliteParameters;
  args: SetControllersArgs;
}): Promise<[Principal, Controller][]> => setControllers(params);
