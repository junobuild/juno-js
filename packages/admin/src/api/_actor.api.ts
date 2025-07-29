import {Actor, type ActorConfig, type ActorMethod, type ActorSubclass} from '@dfinity/agent';
import type {IDL} from '@dfinity/candid';
import {isNullish} from '@dfinity/utils';
import type {
  ActorParameters,
  MissionControlParameters,
  OrbiterParameters,
  SatelliteParameters
} from '../types/actor';
import {
  idlCertifiedFactoryOrbiter,
  idlCertifiedFactorySatellite,
  idlDeprecatedFactoryMissionControlVersion,
  idlDeprecatedFactoryOrbiterVersion,
  idlDeprecatedFactorySatellite,
  idlDeprecatedFactorySatelliteNoScope,
  idlDeprecatedFactorySatelliteVersion,
  idlFactoryMissionControl,
  idlFactoryOrbiter,
  idlFactorySatellite,
  type DeprecatedMissionControlVersionActor,
  type DeprecatedOrbiterVersionActor,
  type DeprecatedSatelliteActor,
  type DeprecatedSatelliteNoScopeActor,
  type DeprecatedSatelliteVersionActor,
  type MissionControlActor,
  type OrbiterActor,
  type SatelliteActor
} from './_actor.factory';
import {useOrInitAgent} from './_agent.api';

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
  certified = false,
  ...rest
}: SatelliteParameters & {certified?: boolean}): Promise<SatelliteActor> =>
  getActor({
    canisterId: satelliteId,
    ...rest,
    idlFactory: certified ? idlCertifiedFactorySatellite : idlFactorySatellite
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

export const getOrbiterActor = ({
  orbiterId,
  certified = false,
  ...rest
}: OrbiterParameters & {certified?: boolean}): Promise<OrbiterActor> =>
  getActor({
    canisterId: orbiterId,
    ...rest,
    idlFactory: certified ? idlCertifiedFactoryOrbiter : idlFactoryOrbiter
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

const createActor = async <T = Record<string, ActorMethod>>({
  canisterId,
  idlFactory,
  config,
  ...rest
}: {
  idlFactory: IDL.InterfaceFactory;
  canisterId: string;
  config?: Pick<ActorConfig, 'callTransform' | 'queryTransform'>;
} & ActorParameters): Promise<ActorSubclass<T>> => {
  const agent = await useOrInitAgent(rest);

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...(config ?? {})
  });
};
