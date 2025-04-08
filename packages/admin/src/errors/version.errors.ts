import {
  JUNO_PACKAGE_MISSION_CONTROL_ID,
  JUNO_PACKAGE_ORBITER_ID,
  JUNO_PACKAGE_SATELLITE_ID
} from '@junobuild/config';

export class SatelliteMissingDependencyError extends Error {
  constructor() {
    super(`Invalid dependency tree: required module ${JUNO_PACKAGE_SATELLITE_ID} is missing.`);
  }
}

export class MissionControlVersionError extends Error {
  constructor() {
    super(`Invalid package: the provided module name is not ${JUNO_PACKAGE_MISSION_CONTROL_ID}.`);
  }
}

export class OrbiterVersionError extends Error {
  constructor() {
    super(`Invalid package: the provided module name is not ${JUNO_PACKAGE_ORBITER_ID}.`);
  }
}
