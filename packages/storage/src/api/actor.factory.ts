import type {
  CommitBatch as ConsoleCommitBatch,
  InitAssetKey as ConsoleInitAssetKey,
  UploadChunk as ConsoleUploadChunk
} from '@junobuild/ic-client/dist/declarations/console/console.did';
import type {
  CommitBatch as SatelliteCommitBatch,
  InitAssetKey as SatelliteInitAssetKey,
  UploadChunk as SatelliteUploadChunk
} from '@junobuild/ic-client/dist/declarations/satellite/satellite.did';

export type {
  ConsoleCommitBatch,
  ConsoleInitAssetKey,
  ConsoleUploadChunk,
  SatelliteCommitBatch,
  SatelliteInitAssetKey,
  SatelliteUploadChunk
};
