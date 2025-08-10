import type {ConsoleActor, SatelliteActor} from '@junobuild/ic-client';
import type {Storage} from './storage';

export type UploadAsset = Required<Omit<Storage, 'token' | 'encoding' | 'description'>> &
  Pick<Storage, 'token' | 'encoding' | 'description'>;

export type UploadAssetActor = SatelliteActor;
export type UploadAssetWithProposalActor = ConsoleActor | SatelliteActor;
