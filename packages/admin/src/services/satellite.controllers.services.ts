import type {Principal} from '@icp-sdk/core/principal';
import type {SatelliteDid, SatelliteParameters} from '@junobuild/ic-client/actor';
import {
  deleteControllers,
  listControllers,
  listDeprecatedNoScopeControllers,
  setControllers
} from '../api/satellite.api';
/**
 * Lists the controllers of a satellite.
 *
 * Note: This only removes controllers from the satellite's in-memory list, which is used for
 * guards and access control within the satellite's features.
 *
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
}): Promise<[Principal, SatelliteDid.Controller][]> => {
  const list = deprecatedNoScope === true ? listDeprecatedNoScopeControllers : listControllers;
  return list(params);
};

/**
 * Sets the controllers of a satellite.
 *
 * Note: This only removes controllers from the satellite's in-memory list, which is used for
 * guards and access control within the satellite's features.
 *
 * @param {Object} params - The parameters for setting the controllers.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @param {SetControllersArgs} params.args - The arguments for setting the controllers.
 * @returns {Promise<[Principal, Controller][]>} A promise that resolves to a list of controllers.
 */
export const setSatelliteControllers = (params: {
  satellite: SatelliteParameters;
  args: SatelliteDid.SetControllersArgs;
}): Promise<[Principal, SatelliteDid.Controller][]> => setControllers(params);

/**
 * Delete selected controllers from a satellite.
 * @param {Object} params - The parameters for setting the controllers.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @param {SetControllersArgs} params.args - The arguments for setting the controllers.
 * @returns {Promise<[Principal, Controller][]>} A promise that resolves to a list of controllers.
 */
export const deleteSatelliteControllers = (params: {
  satellite: SatelliteParameters;
  args: SatelliteDid.DeleteControllersArgs;
}): Promise<[Principal, SatelliteDid.Controller][]> => deleteControllers(params);
