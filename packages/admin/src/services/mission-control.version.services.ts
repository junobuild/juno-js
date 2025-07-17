import {assertNonNullish, isNullish} from '@dfinity/utils';
import {JUNO_PACKAGE_MISSION_CONTROL_ID} from '@junobuild/config';
import {version} from '../api/mission-control.api';
import {MissionControlVersionError} from '../errors/version.errors';
import type {MissionControlParameters} from '../types/actor';
import {getJunoPackage} from './package.services';

/**
 * Retrieves the version of Mission Control.
 * @param {Object} params - The parameters for Mission Control.
 * @param {MissionControlParameters} params.missionControl - The Mission Control parameters.
 * @returns {Promise<string>} A promise that resolves to the version of Mission Control.
 */
export const missionControlVersion = async ({
  missionControl: {missionControlId, ...rest}
}: {
  missionControl: MissionControlParameters;
}): Promise<string> => {
  assertNonNullish(
    missionControlId,
    'A Mission Control ID must be provided to request its version.'
  );

  const pkg = await getJunoPackage({
    moduleId: missionControlId,
    ...rest
  });

  // For backwards compatibility with legacy. Function version() was deprecated in Mission Control > v0.0.14
  if (isNullish(pkg)) {
    return await version({missionControl: {missionControlId, ...rest}});
  }

  const {name, version: missionControlVersion} = pkg;

  if (name === JUNO_PACKAGE_MISSION_CONTROL_ID) {
    return missionControlVersion;
  }

  throw new MissionControlVersionError();
};
