// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlFactoryMissionControl} from '../../declarations/mission_control/mission_control.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlFactoryOrbiter} from '../../declarations/orbiter/orbiter.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlCertifiedFactoryOrbiter} from '../../declarations/orbiter/orbiter.factory.certified.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlDeprecatedFactorySatelliteNoScope} from '../../declarations/deprecated/satellite-deprecated-no-scope.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlDeprecatedFactorySatelliteVersion} from '../../declarations/deprecated/satellite-deprecated-version.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlDeprecatedFactoryOrbiterVersion} from '../../declarations/deprecated/orbiter-deprecated-version.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlDeprecatedFactoryMissionControlVersion} from '../../declarations/deprecated/mission_control-deprecated-version.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlDeprecatedFactorySatellite} from '../../declarations/deprecated/satellite-deprecated.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlFactorySatellite} from '../../declarations/satellite/satellite.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlCertifiedFactorySatellite} from '../../declarations/satellite/satellite.factory.certified.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlFactoryConsole} from '../../declarations/console/console.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlCertifiedFactoryConsole} from '../../declarations/console/console.factory.certified.did.js';

import type {_SERVICE as ConsoleActor} from '../../declarations/console/console.did';
import type {_SERVICE as DeprecatedMissionControlVersionActor} from '../../declarations/deprecated/mission_control-deprecated-version.did';
import type {_SERVICE as DeprecatedOrbiterVersionActor} from '../../declarations/deprecated/orbiter-deprecated-version.did';
import type {_SERVICE as DeprecatedSatelliteNoScopeActor} from '../../declarations/deprecated/satellite-deprecated-no-scope.did';
import type {_SERVICE as DeprecatedSatelliteVersionActor} from '../../declarations/deprecated/satellite-deprecated-version.did';
import type {_SERVICE as DeprecatedSatelliteActor} from '../../declarations/deprecated/satellite-deprecated.did';
import type {_SERVICE as MissionControlActor} from '../../declarations/mission_control/mission_control.did';
import type {_SERVICE as OrbiterActor} from '../../declarations/orbiter/orbiter.did';
import type {_SERVICE as SatelliteActor} from '../../declarations/satellite/satellite.did';

export {
  idlCertifiedFactoryConsole,
  idlCertifiedFactoryOrbiter,
  idlCertifiedFactorySatellite,
  idlDeprecatedFactoryMissionControlVersion,
  idlDeprecatedFactoryOrbiterVersion,
  idlDeprecatedFactorySatellite,
  idlDeprecatedFactorySatelliteNoScope,
  idlDeprecatedFactorySatelliteVersion,
  idlFactoryConsole,
  idlFactoryMissionControl,
  idlFactoryOrbiter,
  idlFactorySatellite,
  type ConsoleActor,
  type DeprecatedMissionControlVersionActor,
  type DeprecatedOrbiterVersionActor,
  type DeprecatedSatelliteActor,
  type DeprecatedSatelliteNoScopeActor,
  type DeprecatedSatelliteVersionActor,
  type MissionControlActor,
  type OrbiterActor,
  type SatelliteActor
};
