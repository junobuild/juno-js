import type {_SERVICE as SatelliteActor} from '../../declarations/satellite/satellite.did';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlFactorySatellite} from '../../declarations/satellite/satellite.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlFactorySputnik} from '../../declarations/sputnik/sputnik.factory.did.js';

export {idlFactorySatellite, idlFactorySputnik, type SatelliteActor};
