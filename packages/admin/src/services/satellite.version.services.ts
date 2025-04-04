import {nonNullish} from '@dfinity/utils';
import {canisterMetadata} from '../api/ic.api';
import {buildVersion, version} from '../api/satellite.api';
import type {SatelliteParameters} from '../types/actor.types';
import type {BuildType} from '../types/build.types';

/**
 * Retrieves the version of the satellite.
 * @param {Object} params - The parameters for retrieving the version.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<string>} A promise that resolves to the version of the satellite.
 */
export const satelliteVersion = (params: {satellite: SatelliteParameters}): Promise<string> =>
  version(params);

/**
 * Retrieves the build version of the satellite.
 * @param {Object} params - The parameters for retrieving the build version.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<string>} A promise that resolves to the build version of the satellite.
 */
export const satelliteBuildVersion = (params: {satellite: SatelliteParameters}): Promise<string> =>
  buildVersion(params);

/**
 * Retrieves the build type of the satellite.
 * @param {Object} params - The parameters for retrieving the build type.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<BuildType | undefined>} A promise that resolves to the build type of the satellite or undefined if not found.
 */
export const satelliteBuildType = async ({
  satellite: {satelliteId, ...rest}
}: {
  satellite: SatelliteParameters;
}): Promise<BuildType | undefined> => {
  const status = await canisterMetadata({...rest, canisterId: satelliteId, path: 'juno:build'});

  return nonNullish(status) && ['stock', 'extended', 'sputnik'].includes(status as string)
    ? (status as BuildType)
    : undefined;
};
