import {Principal} from '@dfinity/principal';
import type {Controller} from '../../declarations/mission_control/mission_control.did';
import {upgradeCode} from '../api/ic.api';
import {
  getUser,
  listControllers,
  setMissionControlController as setMissionControlControllerApi,
  setSatellitesController as setSatellitesControllerApi,
  version
} from '../api/mission-control.api';
import type {MissionControlParameters} from '../types/actor.types';
import type {SetControllerParams} from '../types/controllers.types';
import {mapSetControllerParams} from '../utils/controllers.utils';
import {encoreIDLUser} from '../utils/idl.utils';

/**
 * Retrieves the version of Mission Control.
 * @param {Object} params - The parameters for Mission Control.
 * @param {MissionControlParameters} params.missionControl - The Mission Control parameters.
 * @returns {Promise<string>} A promise that resolves to the version of Mission Control.
 */
export const missionControlVersion = async (params: {
  missionControl: MissionControlParameters;
}): Promise<string> => version(params);

/**
 * Upgrades the Mission Control with the provided WASM module.
 * @param {Object} params - The parameters for upgrading Mission Control.
 * @param {MissionControlParameters} params.missionControl - The Mission Control parameters.
 * @param {Uint8Array} params.wasm_module - The WASM module for the upgrade.
 * @throws Will throw an error if no mission control principal is defined.
 * @returns {Promise<void>} A promise that resolves when the upgrade is complete.
 */
export const upgradeMissionControl = async ({
  missionControl,
  wasm_module
}: {
  missionControl: MissionControlParameters;
  wasm_module: Uint8Array;
}): Promise<void> => {
  const user = await getUser({missionControl});

  const {missionControlId, ...actor} = missionControl;

  if (!missionControlId) {
    throw new Error('No mission control principal defined.');
  }

  const arg = encoreIDLUser(user);

  await upgradeCode({
    actor,
    code: {
      canister_id: Principal.fromText(missionControlId),
      arg: new Uint8Array(arg),
      wasm_module,
      mode: {upgrade: [{skip_pre_upgrade: [false]}]}
    }
  });
};

/**
 * Sets the controller for the specified satellites.
 * @param {Object} params - The parameters for setting the satellites controller.
 * @param {MissionControlParameters} params.missionControl - The Mission Control parameters.
 * @param {Principal[]} params.satelliteIds - The IDs of the satellites.
 * @param {SetControllerParams} params - Additional parameters for setting the controller.
 * @returns {Promise<void>} A promise that resolves when the controller is set.
 */
export const setSatellitesController = async ({
  controllerId,
  profile,
  ...rest
}: {
  missionControl: MissionControlParameters;
  satelliteIds: Principal[];
} & SetControllerParams): Promise<void> =>
  setSatellitesControllerApi({
    ...rest,
    ...mapSetControllerParams({controllerId, profile})
  });

/**
 * Sets the controller for Mission Control.
 * @param {Object} params - The parameters for setting the Mission Control controller.
 * @param {MissionControlParameters} params.missionControl - The Mission Control parameters.
 * @param {SetControllerParams} params - Additional parameters for setting the controller.
 * @returns {Promise<void>} A promise that resolves when the controller is set.
 */
export const setMissionControlController = async ({
  controllerId,
  profile,
  ...rest
}: {
  missionControl: MissionControlParameters;
} & SetControllerParams): Promise<void> =>
  setMissionControlControllerApi({
    ...rest,
    ...mapSetControllerParams({controllerId, profile})
  });

/**
 * Lists the controllers of Mission Control.
 * @param {Object} params - The parameters for listing the controllers.
 * @param {MissionControlParameters} params.missionControl - The Mission Control parameters.
 * @returns {Promise<[Principal, Controller][]>} A promise that resolves to a list of controllers.
 */
export const listMissionControlControllers = (params: {
  missionControl: MissionControlParameters;
}): Promise<[Principal, Controller][]> => listControllers(params);
