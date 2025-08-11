import type {Principal} from '@dfinity/principal';
import {type MissionControlDid,
  type MissionControlParameters,
  getDeprecatedMissionControlVersionActor,
  getMissionControlActor
} from '@junobuild/ic-client';

/**
 * @deprecated - Replaced in Mission Control > v0.0.14 with public custom section juno:package
 */
export const version = async ({
  missionControl
}: {
  missionControl: MissionControlParameters;
}): Promise<string> => {
  const {version} = await getDeprecatedMissionControlVersionActor(missionControl);
  return version();
};

export const getUser = async ({
  missionControl
}: {
  missionControl: MissionControlParameters;
}): Promise<Principal> => {
  const {get_user} = await getMissionControlActor(missionControl);
  return get_user();
};

export const listControllers = async ({
  missionControl
}: {
  missionControl: MissionControlParameters;
}): Promise<[Principal, MissionControlDid.Controller][]> => {
  const {list_mission_control_controllers} = await getMissionControlActor(missionControl);
  return list_mission_control_controllers();
};

export const setSatellitesController = async ({
  missionControl,
  satelliteIds,
  controllerIds,
  controller
}: {
  missionControl: MissionControlParameters;
  satelliteIds: Principal[];
  controllerIds: Principal[];
  controller: MissionControlDid.SetController;
}) => {
  const {set_satellites_controllers} = await getMissionControlActor(missionControl);
  return set_satellites_controllers(satelliteIds, controllerIds, controller);
};

export const setMissionControlController = async ({
  missionControl,
  controllerIds,
  controller
}: {
  missionControl: MissionControlParameters;
  controllerIds: Principal[];
  controller: MissionControlDid.SetController;
}) => {
  const {set_mission_control_controllers} = await getMissionControlActor(missionControl);
  return set_mission_control_controllers(controllerIds, controller);
};
