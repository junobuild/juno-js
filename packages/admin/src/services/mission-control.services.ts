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

export const missionControlVersion = async (params: {
  missionControl: MissionControlParameters;
}): Promise<string> => version(params);

export const upgradeMissionControl = async ({
  missionControl,
  wasm_module
}: {
  missionControl: MissionControlParameters;
  wasm_module: Uint8Array;
}) => {
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
      mode: {upgrade: null}
    }
  });
};

export const setSatellitesController = async ({
  controllerId,
  profile,
  ...rest
}: {
  missionControl: MissionControlParameters;
  satelliteIds: Principal[];
} & SetControllerParams) =>
  setSatellitesControllerApi({
    ...rest,
    ...mapSetControllerParams({controllerId, profile})
  });

export const setMissionControlController = async ({
  controllerId,
  profile,
  ...rest
}: {
  missionControl: MissionControlParameters;
} & SetControllerParams) =>
  setMissionControlControllerApi({
    ...rest,
    ...mapSetControllerParams({controllerId, profile})
  });

export const listMissionControlControllers = (params: {
  missionControl: MissionControlParameters;
}): Promise<[Principal, Controller][]> => listControllers(params);
