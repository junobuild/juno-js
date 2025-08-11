import type {
  CommitBatch as ConsoleCommitBatch,
  InitAssetKey as ConsoleInitAssetKey,
  InitUploadResult as ConsoleInitUploadResult,
  UploadChunk as ConsoleUploadChunk
} from '@junobuild/ic-client/dist/declarations/console/console.did';
import type {
  CommitBatch as SatelliteCommitBatch,
  InitAssetKey as SatelliteInitAssetKey,
  InitUploadResult as SatelliteInitUploadResult,
  UploadChunk as SatelliteUploadChunk
} from '@junobuild/ic-client/dist/declarations/satellite/satellite.did';

export type {
  ConsoleCommitBatch,
  ConsoleInitAssetKey,
  ConsoleInitUploadResult,
  ConsoleUploadChunk,
  SatelliteCommitBatch,
  SatelliteInitAssetKey,
  SatelliteInitUploadResult,
  SatelliteUploadChunk
};
