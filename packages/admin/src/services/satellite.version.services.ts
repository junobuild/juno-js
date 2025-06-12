import {assertNonNullish, isNullish, nonNullish} from '@dfinity/utils';
import {JUNO_PACKAGE_SATELLITE_ID} from '@junobuild/config';
import {canisterMetadata} from '../api/ic.api';
import {version} from '../api/satellite.api';
import {SatelliteMissingDependencyError} from '../errors/version.errors';
import {findJunoPackageDependency} from '../helpers/package.helpers';
import type {SatelliteParameters} from '../types/actor.types';
import type {BuildType} from '../types/build.types';
import {getJunoPackage} from './package.services';

/**
 * Retrieves the version of the satellite.
 * @param {Object} params - The parameters for retrieving the version.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<string>} A promise that resolves to the version of the satellite.
 */
export const satelliteVersion = async ({
  satellite: {satelliteId, ...rest}
}: {
  satellite: SatelliteParameters;
}): Promise<string> => {
  assertNonNullish(satelliteId, 'A Satellite ID must be provided to request its version.');

  const pkg = await getJunoPackage({
    moduleId: satelliteId,
    ...rest
  });

  // For backwards compatibility with legacy. Function version() was deprecated in Satellite > v0.0.22
  if (isNullish(pkg)) {
    return await version({satellite: {satelliteId, ...rest}});
  }

  const {name, version: satelliteVersion, dependencies} = pkg;

  if (name === JUNO_PACKAGE_SATELLITE_ID) {
    return satelliteVersion;
  }

  const satelliteDependency = findJunoPackageDependency({
    dependencies,
    dependencyId: JUNO_PACKAGE_SATELLITE_ID
  });

  if (nonNullish(satelliteDependency)) {
    const [_, satelliteVersion] = satelliteDependency;
    return satelliteVersion;
  }

  throw new SatelliteMissingDependencyError();
};

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
  assertNonNullish(satelliteId, 'A Satellite ID must be provided to request its version.');

  const pkg = await getJunoPackage({
    moduleId: satelliteId,
    ...rest
  });

  if (isNullish(pkg)) {
    return await satelliteDeprecatedBuildType({satellite: {satelliteId, ...rest}});
  }

  const {name, dependencies} = pkg;

  if (name === JUNO_PACKAGE_SATELLITE_ID) {
    return 'stock';
  }

  const satelliteDependency = findJunoPackageDependency({
    dependencies,
    dependencyId: JUNO_PACKAGE_SATELLITE_ID
  });

  if (nonNullish(satelliteDependency)) {
    return 'extended';
  }

  throw new SatelliteMissingDependencyError();
};

/**
 * @deprecated Replaced in Satellite > v0.0.22
 */
const satelliteDeprecatedBuildType = async ({
  satellite: {satelliteId, ...rest}
}: {
  satellite: Omit<SatelliteParameters, 'satelliteId'> &
    Required<Pick<SatelliteParameters, 'satelliteId'>>;
}): Promise<BuildType | undefined> => {
  const status = await canisterMetadata({...rest, canisterId: satelliteId, path: 'juno:build'});

  return nonNullish(status) && ['stock', 'extended'].includes(status as string)
    ? (status as BuildType)
    : undefined;
};
