import type {CallConfig} from '@dfinity/agent';
import type {IDL} from '@dfinity/candid';
import {Principal} from '@dfinity/principal';
import type {_SERVICE as ConsoleActor} from '../../declarations/console/console.did';
import {idlFactory as idlFactoryConsole} from '../../declarations/console/console.factory.did.js';
import type {_SERVICE as ICActor} from '../../declarations/ic/ic.did';
import {idlFactory as idlFactorIC} from '../../declarations/ic/ic.factory.did';
import type {_SERVICE as MissionControlActor} from '../../declarations/mission_control/mission_control.did';
import {idlFactory as idlFactoryMissionControl} from '../../declarations/mission_control/mission_control.factory.did.js';
import type {_SERVICE as OrbiterActor} from '../../declarations/orbiter/orbiter.did';
import {idlFactory as idlFactoryOrbiter} from '../../declarations/orbiter/orbiter.factory.did.js';
import type {_SERVICE as DeprecatedSatelliteNoScopeActor} from '../../declarations/satellite/satellite-deprecated-no-scope.did';
import {idlFactory as idlDeprecatedFactorySatelliteNoScope} from '../../declarations/satellite/satellite-deprecated-no-scope.factory.did.js';
import type {_SERVICE as DeprecatedSatelliteActor} from '../../declarations/satellite/satellite-deprecated.did';
import {idlFactory as idlDeprecatedFactorySatellite} from '../../declarations/satellite/satellite-deprecated.factory.did.js';
import type {_SERVICE as SatelliteActor} from '../../declarations/satellite/satellite.did';
import {idlFactory as idlFactorySatellite} from '../../declarations/satellite/satellite.factory.did.js';
import type {
  ActorParameters,
  ConsoleParameters,
  MissionControlParameters,
  OrbiterParameters,
  SatelliteParameters
} from '../types/actor.types';
import {createActor} from '../utils/actor.utils';

// TODO: for backwards compatibility - to be removed
export const getDeprecatedSatelliteActor = async ({
  satelliteId,
  ...rest
}: SatelliteParameters): Promise<DeprecatedSatelliteActor> =>
  getActor({
    canisterId: satelliteId,
    ...rest,
    idlFactory: idlDeprecatedFactorySatellite
  });

export const getSatelliteActor = async ({
  satelliteId,
  ...rest
}: SatelliteParameters): Promise<SatelliteActor> =>
  getActor({
    canisterId: satelliteId,
    ...rest,
    idlFactory: idlFactorySatellite
  });

// TODO: for backwards compatibility - to be removed
export const getDeprecatedSatelliteNoScopeActor = async ({
  satelliteId,
  ...rest
}: SatelliteParameters): Promise<DeprecatedSatelliteNoScopeActor> =>
  getActor({
    canisterId: satelliteId,
    ...rest,
    idlFactory: idlDeprecatedFactorySatelliteNoScope
  });

export const getMissionControlActor = async ({
  missionControlId,
  ...rest
}: MissionControlParameters): Promise<MissionControlActor> =>
  getActor({
    canisterId: missionControlId,
    ...rest,
    idlFactory: idlFactoryMissionControl
  });

export const getOrbiterActor = async ({
  orbiterId,
  ...rest
}: OrbiterParameters): Promise<OrbiterActor> =>
  getActor({
    canisterId: orbiterId,
    ...rest,
    idlFactory: idlFactoryOrbiter
  });

export const getConsoleActor = async ({
  consoleId,
  ...rest
}: ConsoleParameters): Promise<ConsoleActor> =>
  getActor({
    canisterId: consoleId,
    ...rest,
    idlFactory: idlFactoryConsole
  });

export const getActor = async <T>({
  canisterId,
  idlFactory,
  ...rest
}: ActorParameters & {
  canisterId: string | undefined;
  idlFactory: IDL.InterfaceFactory;
}): Promise<T> => {
  if (!canisterId) {
    throw new Error('No canister ID provided.');
  }

  return createActor({
    canisterId,
    idlFactory,
    ...rest
  });
};

const MANAGEMENT_CANISTER_ID = Principal.fromText('aaaaa-aa');

// Source nns-dapp - dart -> JS bridge
const transform = (
  _methodName: string,
  args: unknown[],
  _callConfig: CallConfig
): {effectiveCanisterId: Principal} => {
  const first = args[0] as unknown;
  let effectiveCanisterId = MANAGEMENT_CANISTER_ID;
  if (first && typeof first === 'object' && first['canister_id']) {
    effectiveCanisterId = Principal.from(first['canister_id'] as unknown);
  }

  return {effectiveCanisterId};
};

export const getICActor = (params: ActorParameters): Promise<ICActor> =>
  createActor<ICActor>({
    canisterId: MANAGEMENT_CANISTER_ID.toText(),
    config: {
      callTransform: transform,
      queryTransform: transform
    },
    idlFactory: idlFactorIC,
    ...params
  });
