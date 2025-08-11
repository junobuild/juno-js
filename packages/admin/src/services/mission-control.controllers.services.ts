import type {Principal} from '@dfinity/principal';
import type {MissionControlDid, MissionControlParameters} from '@junobuild/ic-client';
import {
  listControllers,
  setMissionControlController as setMissionControlControllerApi,
  setSatellitesController as setSatellitesControllerApi
} from '../api/mission-control.api';
import type {SetControllerParams} from '../types/controllers';
import {mapSetControllerParams} from '../utils/controllers.utils';

/**
 * Sets the controller for the specified satellites.
 * @param {Object} params - The parameters for setting the satellites controller.
 * @param {MissionControlParameters} params.missionControl - The Mission Control parameters.
 * @param {Principal[]} params.satelliteIds - The IDs of the satellites.
 * @param {SetControllerParams} params - Additional parameters for setting the controller.
 * @returns {Promise<void>} A promise that resolves when the controller is set.
 */
export const setSatellitesController = ({
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
export const setMissionControlController = ({
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
}): Promise<[Principal, MissionControlDid.Controller][]> => listControllers(params);
