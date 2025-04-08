import {JUNO_PACKAGE_SATELLITE_ID} from '@junobuild/config';

export class SatelliteMissingDependencyError extends Error {
  constructor() {
    super(`Invalid dependency tree: required module ${JUNO_PACKAGE_SATELLITE_ID} is missing.`);
  }
}
