import type {Principal} from '@dfinity/principal';
import type {SatelliteDid, SatelliteParameters} from '@junobuild/ic-client';
import {
  listControllers,
  listDeprecatedNoScopeControllers,
  setControllers
} from '../api/satellite.api';
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
}): Promise<[Principal, SatelliteDid.Controller][]> => {
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
  args: SatelliteDid.SetControllersArgs;
}): Promise<[Principal, SatelliteDid.Controller][]> => setControllers(params);
