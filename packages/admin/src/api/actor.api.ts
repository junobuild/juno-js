import type {IDL} from '@dfinity/candid';
import {isNullish} from '@dfinity/utils';
import type {_SERVICE as DeprecatedMissionControlVersionActor} from '../../declarations/mission_control/mission_control-deprecated-version.did';
import type {_SERVICE as MissionControlActor} from '../../declarations/mission_control/mission_control.did';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlFactoryMissionControl} from '../../declarations/mission_control/mission_control.factory.did.js';
import type {_SERVICE as DeprecatedOrbiterVersionActor} from '../../declarations/orbiter/orbiter-deprecated-version.did';
import type {_SERVICE as OrbiterActor} from '../../declarations/orbiter/orbiter.did';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlFactoryOrbiter} from '../../declarations/orbiter/orbiter.factory.did.js';
import type {_SERVICE as DeprecatedSatelliteNoScopeActor} from '../../declarations/satellite/satellite-deprecated-no-scope.did';
import type {_SERVICE as DeprecatedSatelliteVersionActor} from '../../declarations/satellite/satellite-deprecated-version.did';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlDeprecatedFactorySatelliteNoScope} from '../../declarations/satellite/satellite-deprecated-no-scope.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlDeprecatedFactorySatelliteVersion} from '../../declarations/satellite/satellite-deprecated-version.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlDeprecatedFactoryOrbiterVersion} from '../../declarations/orbiter/orbiter-deprecated-version.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlDeprecatedFactoryMissionControlVersion} from '../../declarations/mission_control/mission_control-deprecated-version.factory.did.js';
import type {_SERVICE as DeprecatedSatelliteActor} from '../../declarations/satellite/satellite-deprecated.did';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlDeprecatedFactorySatellite} from '../../declarations/satellite/satellite-deprecated.factory.did.js';
import type {_SERVICE as SatelliteActor} from '../../declarations/satellite/satellite.did';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlFactorySatellite} from '../../declarations/satellite/satellite.factory.did.js';
import type {
  ActorParameters,
  MissionControlParameters,
  OrbiterParameters,
  SatelliteParameters
} from '../types/actor.types';
import {createActor} from '../utils/actor.utils';

/**
 * @deprecated TODO: for backwards compatibility - to be removed
 */
export const getDeprecatedSatelliteActor = ({
  satelliteId,
  ...rest
}: SatelliteParameters): Promise<DeprecatedSatelliteActor> =>
  getActor({
    canisterId: satelliteId,
    ...rest,
    idlFactory: idlDeprecatedFactorySatellite
  });

export const getSatelliteActor = ({
  satelliteId,
  ...rest
}: SatelliteParameters): Promise<SatelliteActor> =>
  getActor({
    canisterId: satelliteId,
    ...rest,
    idlFactory: idlFactorySatellite
  });

/**
 * @deprecated TODO: for backwards compatibility - to be removed
 */
export const getDeprecatedSatelliteNoScopeActor = ({
  satelliteId,
  ...rest
}: SatelliteParameters): Promise<DeprecatedSatelliteNoScopeActor> =>
  getActor({
    canisterId: satelliteId,
    ...rest,
    idlFactory: idlDeprecatedFactorySatelliteNoScope
  });

/**
 * @deprecated TODO: for backwards compatibility - to be removed
 */
export const getDeprecatedSatelliteVersionActor = ({
  satelliteId,
  ...rest
}: SatelliteParameters): Promise<DeprecatedSatelliteVersionActor> =>
  getActor({
    canisterId: satelliteId,
    ...rest,
    idlFactory: idlDeprecatedFactorySatelliteVersion
  });

export const getMissionControlActor = ({
  missionControlId,
  ...rest
}: MissionControlParameters): Promise<MissionControlActor> =>
  getActor({
    canisterId: missionControlId,
    ...rest,
    idlFactory: idlFactoryMissionControl
  });

/**
 * @deprecated TODO: for backwards compatibility - to be removed
 */
export const getDeprecatedMissionControlVersionActor = ({
  missionControlId,
  ...rest
}: MissionControlParameters): Promise<DeprecatedMissionControlVersionActor> =>
  getActor({
    canisterId: missionControlId,
    ...rest,
    idlFactory: idlDeprecatedFactoryMissionControlVersion
  });

export const getOrbiterActor = ({orbiterId, ...rest}: OrbiterParameters): Promise<OrbiterActor> =>
  getActor({
    canisterId: orbiterId,
    ...rest,
    idlFactory: idlFactoryOrbiter
  });

/**
 * @deprecated TODO: for backwards compatibility - to be removed
 */
export const getDeprecatedOrbiterVersionActor = ({
  orbiterId,
  ...rest
}: OrbiterParameters): Promise<DeprecatedOrbiterVersionActor> =>
  getActor({
    canisterId: orbiterId,
    ...rest,
    idlFactory: idlDeprecatedFactoryOrbiterVersion
  });

export const getActor = <T>({
  canisterId,
  idlFactory,
  ...rest
}: ActorParameters & {
  canisterId: string | undefined;
  idlFactory: IDL.InterfaceFactory;
}): Promise<T> => {
  if (isNullish(canisterId)) {
    throw new Error('No canister ID provided.');
  }

  return createActor({
    canisterId,
    idlFactory,
    ...rest
  });
};
