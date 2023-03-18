import type {Principal} from '@dfinity/principal';
import type {
  Config,
  Controller,
  _SERVICE as SatelliteActor
} from '../../declarations/satellite/satellite.did';
import type {SatelliteParameters} from '../types/actor.types';
import {getSatelliteActor} from './actor.api';

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

export const listControllers = async ({
  satellite
}: {
  satellite: SatelliteParameters;
}): Promise<[Principal, Controller][]> => {
  const actor: SatelliteActor = await getSatelliteActor(satellite);
  return actor.list_controllers();
};
