import type {
  _SERVICE as ConsoleActor,
  CommitBatch as ConsoleCommitBatch,
  InitAssetKey as ConsoleInitAssetKey,
  UploadChunk as ConsoleUploadChunk
} from '../../declarations/console/console.did';
import type {
  _SERVICE as SatelliteActor,
  CommitBatch as SatelliteCommitBatch,
  InitAssetKey as SatelliteInitAssetKey,
  UploadChunk as SatelliteUploadChunk
} from '../../declarations/satellite/satellite.did';

export {
  ConsoleActor,
  ConsoleCommitBatch,
  ConsoleInitAssetKey,
  ConsoleUploadChunk,
  SatelliteActor,
  SatelliteCommitBatch,
  SatelliteInitAssetKey,
  SatelliteUploadChunk
};
