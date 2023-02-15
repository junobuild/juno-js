import type {Principal} from '@dfinity/principal';
import type {_SERVICE as MissionControlActor} from '../../declarations/mission_control/mission_control.did';
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
}): Promise<Principal[]> => {
  const actor: MissionControlActor = await getMissionControlActor(missionControl);
  return actor.list_mission_control_controllers();
};
