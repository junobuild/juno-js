import {assertNonNullish, isNullish} from '@dfinity/utils';
import {JUNO_PACKAGE_ORBITER_ID} from '@junobuild/config';
import {version} from '../api/orbiter.api';
import {OrbiterVersionError} from '../errors/version.errors';
import type {OrbiterParameters} from '../types/actor';
import {getJunoPackage} from './package.services';

/**
 * Retrieves the version of the Orbiter.
 * @param {Object} params - The parameters for the Orbiter.
 * @param {OrbiterParameters} params.orbiter - The Orbiter parameters.
 * @returns {Promise<string>} A promise that resolves to the version of the Orbiter.
 */
export const orbiterVersion = async ({
  orbiter: {orbiterId, ...rest}
}: {
  orbiter: OrbiterParameters;
}): Promise<string> => {
  assertNonNullish(orbiterId, 'An Orbiter ID must be provided to request its version.');

  const pkg = await getJunoPackage({
    moduleId: orbiterId,
    ...rest
  });

  // For backwards compatibility with legacy. Function version() was deprecated in Mission Control > v0.0.8
  if (isNullish(pkg)) {
    return await version({orbiter: {orbiterId, ...rest}});
  }

  const {name, version: missionControlVersion} = pkg;

  if (name === JUNO_PACKAGE_ORBITER_ID) {
    return missionControlVersion;
  }

  throw new OrbiterVersionError();
};
