import type {ConsoleActor, SatelliteActor} from '@junobuild/ic-client/actor';
import type {OnUploadProgress} from './progress';
import type {Storage} from './storage';

export type UploadAsset = Required<Omit<Storage, 'token' | 'encoding' | 'description'>> &
  Pick<Storage, 'token' | 'encoding' | 'description'>;

export type UploadAssetActor = SatelliteActor;
export type UploadAssetWithProposalActor = ConsoleActor | SatelliteActor;

export type UploadParams = {
  actor: UploadAssetActor;
} & OnUploadProgress;

export type UploadWithProposalParams = {
  proposalId: bigint;
  actor: UploadAssetWithProposalActor;
} & OnUploadProgress;
