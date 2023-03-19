import type {Principal} from '@dfinity/principal';
import type {_SERVICE as DeprecatedSatelliteActor} from '../../declarations/satellite/satellite-deprecated.did';
import type {
  Config,
  Controller,
  _SERVICE as SatelliteActor
} from '../../declarations/satellite/satellite.did';
import type {SatelliteParameters} from '../types/actor.types';
import {getDeprecatedSatelliteActor, getSatelliteActor} from './actor.api';

export const setConfig = async ({
  config,
  satellite
}: {
  config: Config;
  satellite: SatelliteParameters;
}): Promise<void> => {
  const actor: SatelliteActor = await getSatelliteActor(satellite);

  return actor.set_config(config);
};

export const version = async ({satellite}: {satellite: SatelliteParameters}): Promise<string> => {
  const actor: SatelliteActor = await getSatelliteActor(satellite);

  return actor.version();
};

// TODO: for backwards compatibility - to be removed
export const listDeprecatedControllers = async ({
  satellite
}: {
  satellite: SatelliteParameters;
}): Promise<Principal[]> => {
  const actor: DeprecatedSatelliteActor = await getDeprecatedSatelliteActor(satellite);
  return actor.list_controllers();
};

export const listControllers = async ({
  satellite
}: {
  satellite: SatelliteParameters;
}): Promise<[Principal, Controller][]> => {
  const actor: SatelliteActor = await getSatelliteActor(satellite);
  return actor.list_controllers();
};
