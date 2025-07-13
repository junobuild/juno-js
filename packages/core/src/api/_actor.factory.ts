import type {_SERVICE as SatelliteActor} from '../../declarations/satellite/satellite.did';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as satelliteIdlFactory} from '../../declarations/satellite/satellite.factory.did.js';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as sputnikIdlFactory} from '../../declarations/sputnik/sputnik.factory.did.js';

export {satelliteIdlFactory, sputnikIdlFactory, type SatelliteActor};
