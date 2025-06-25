import {z} from 'zod/v4';
import {
  type Asset,
  AssetSchema,
  type Batch,
  BatchSchema,
  type CommitBatch,
  CommitBatchSchema
} from '../../../schemas/storage';

/**
 * @see AssetAssertUpload
 */
export const AssetAssertUploadSchema = z
  .object({
    current: AssetSchema.optional(),
    batch: BatchSchema,
    commit_batch: CommitBatchSchema
  })
  .strict();

/**
 * Represents a validation context before uploading an asset.
 */
export interface AssetAssertUpload {
  /**
   * The current asset already stored (if any).
   */
  current?: Asset;

  /**
   * The batch metadata being uploaded.
   */
  batch: Batch;

  /**
   * The commit data describing headers and chunk ids.
   */
  commit_batch: CommitBatch;
}
