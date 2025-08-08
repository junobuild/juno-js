import type {_SERVICE as ConsoleActor} from '../../declarations/console/console.did';
import type {_SERVICE as SatelliteActor} from '../../declarations/satellite/satellite.did';
import type {Storage} from './storage';

export type UploadAsset = Required<Omit<Storage, 'token' | 'encoding' | 'description'>> &
  Pick<Storage, 'token' | 'encoding' | 'description'>;

export type UploadAssetActor = SatelliteActor;
export type UploadAssetWithProposalActor = ConsoleActor | SatelliteActor;
