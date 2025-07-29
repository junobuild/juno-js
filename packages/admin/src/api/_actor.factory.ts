// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlFactoryMissionControl} from '../../declarations/mission_control/mission_control.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlFactoryOrbiter} from '../../declarations/orbiter/orbiter.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlCertifiedFactoryOrbiter} from '../../declarations/orbiter/orbiter.factory.certified.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlDeprecatedFactorySatelliteNoScope} from '../../declarations/satellite/satellite-deprecated-no-scope.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlDeprecatedFactorySatelliteVersion} from '../../declarations/satellite/satellite-deprecated-version.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlDeprecatedFactoryOrbiterVersion} from '../../declarations/orbiter/orbiter-deprecated-version.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlDeprecatedFactoryMissionControlVersion} from '../../declarations/mission_control/mission_control-deprecated-version.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlDeprecatedFactorySatellite} from '../../declarations/satellite/satellite-deprecated.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlFactorySatellite} from '../../declarations/satellite/satellite.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlCertifiedFactorySatellite} from '../../declarations/satellite/satellite.factory.certified.did.js';

import type {_SERVICE as DeprecatedMissionControlVersionActor} from '../../declarations/mission_control/mission_control-deprecated-version.did';
import type {_SERVICE as MissionControlActor} from '../../declarations/mission_control/mission_control.did';
import type {_SERVICE as DeprecatedOrbiterVersionActor} from '../../declarations/orbiter/orbiter-deprecated-version.did';
import type {_SERVICE as OrbiterActor} from '../../declarations/orbiter/orbiter.did';
import type {_SERVICE as DeprecatedSatelliteNoScopeActor} from '../../declarations/satellite/satellite-deprecated-no-scope.did';
import type {_SERVICE as DeprecatedSatelliteVersionActor} from '../../declarations/satellite/satellite-deprecated-version.did';
import type {_SERVICE as DeprecatedSatelliteActor} from '../../declarations/satellite/satellite-deprecated.did';
import type {_SERVICE as SatelliteActor} from '../../declarations/satellite/satellite.did';

export {
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
};
