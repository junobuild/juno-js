import {Principal} from '@dfinity/principal';
import type {
  Controller,
  SetController,
  _SERVICE as MissionControlActor
} from '../../declarations/mission_control/mission_control.did';
import type {MissionControlParameters} from '../types/actor.types';
import {getMissionControlActor} from './actor.api';

export const version = async ({
  missionControl
}: {
  missionControl: MissionControlParameters;
}): Promise<string> => {
  const actor: MissionControlActor = await getMissionControlActor(missionControl);
  return actor.version();
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
