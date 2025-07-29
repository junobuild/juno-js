import type {Principal} from '@dfinity/principal';
import type {
  Controller,
  _SERVICE as MissionControlActor,
  SetController
} from '../../declarations/mission_control/mission_control.did';
import type {MissionControlParameters} from '../types/actor';
import {getDeprecatedMissionControlVersionActor, getMissionControlActor} from './_actor.api';

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
  const actor: MissionControlActor = await getMissionControlActor(missionControl);
  return actor.get_user();
};

export const listControllers = async ({
  missionControl
}: {
  missionControl: MissionControlParameters;
}): Promise<[Principal, Controller][]> => {
  const actor: MissionControlActor = await getMissionControlActor(missionControl);
  return actor.list_mission_control_controllers();
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
  controller: SetController;
}) => {
  const actor: MissionControlActor = await getMissionControlActor(missionControl);
  return actor.set_satellites_controllers(satelliteIds, controllerIds, controller);
};

export const setMissionControlController = async ({
  missionControl,
  controllerIds,
  controller
}: {
  missionControl: MissionControlParameters;
  controllerIds: Principal[];
  controller: SetController;
}) => {
  const actor: MissionControlActor = await getMissionControlActor(missionControl);
  return actor.set_mission_control_controllers(controllerIds, controller);
};
