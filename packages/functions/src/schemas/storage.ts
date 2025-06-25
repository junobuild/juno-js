import { z } from 'zod/v4';
import {Uint8ArraySchema} from './candid';
import {
  type Collection,
  CollectionSchema,
  type Description,
  DescriptionSchema,
  type RawUserId,
  RawUserIdSchema,
  type Timestamp,
  TimestampSchema,
  type Version,
  VersionSchema
} from './satellite';

/**
 * @see HeaderField
 */
const HeaderFieldSchema = z.tuple([z.string(), z.string()]);

/**
 * Represents a single HTTP header as a tuple of name and value.
 */
export type HeaderField = [string, string];

/**
 * @see HeaderFields
 */
export const HeaderFieldsSchema = z.array(HeaderFieldSchema);

/**
 * Represents a list of HTTP headers.
 */
export type HeaderFields = HeaderField[];

/**
 * @see Blob
 */
export const BlobSchema = Uint8ArraySchema;

/**
 * Binary content used in asset encoding.
 */
export type Blob = Uint8Array;

/**
 * @see BlobOrKey
 */
const BlobOrKeySchema = BlobSchema;

/**
 * When stable memory is used, chunks are saved within a StableBTreeMap and their keys - StableEncodingChunkKey - are saved for reference as serialized values
 */
export type BlobOrKey = Uint8Array;

/**
 * @see Hash
 */
const HashSchema = z.instanceof(Uint8Array).refine((val) => val.length === 32, {
  message: 'Hash must be a Uint8Array of length 32'
});

/**
 * Represents a SHA-256 hash as a 32-byte binary value.
 */
export type Hash = Uint8Array;

/**
 * @see AssetKey
 */
export const AssetKeySchema = z
  .object({
    name: z.string(),
    full_path: z.string(),
    token: z.string().optional(),
    collection: CollectionSchema,
    owner: RawUserIdSchema,
    description: DescriptionSchema.optional()
  })
  .strict();

/**
 * Metadata identifying an asset within a collection and the storage system.
 */
export interface AssetKey {
  /**
   * The name of the asset (e.g., "logo.png").
   */
  name: string;

  /**
   * The full relative path of the asset (e.g., "/images/logo.png").
   */
  full_path: string;

  /**
   * Optional access token for the asset.
   * If set, can be used using a query parameter e.g. /full_path/?token=1223-3345-5564-3333
   */
  token?: string;

  /**
   * The collection to which this asset belongs.
   */
  collection: Collection;

  /**
   * The owner of the asset.
   */
  owner: RawUserId;

  /**
   * Optional description of the asset for indexing/search.
   */
  description?: Description;
}

/**
 * @see AssetEncoding
 */
export const AssetEncodingSchema = z.object({
  modified: TimestampSchema,
  content_chunks: z.array(BlobOrKeySchema),
  total_length: z.bigint(),
  sha256: HashSchema
});

/**
 * Represents a specific encoding of an asset, such as "gzip" or "identity" (no compression).
 */
export interface AssetEncoding {
  /**
   * Timestamp when the encoding was last modified.
   */
  modified: Timestamp;

  /**
   * Chunks of binary content or references to them.
   */
  content_chunks: BlobOrKey[];

  /**
   * Total byte size of the encoded content.
   */
  total_length: bigint;

  /**
   * SHA-256 hash of the encoded content.
   */
  sha256: Hash;
}

/**
 * @see AssetEncodingNoContent
 */
const AssetEncodingNoContentSchema = AssetEncodingSchema.omit({content_chunks: true}).strict();

/**
 * Represents a specific encoding of an asset, such as "gzip" or "identity" (no compression), without the chunks.
 */
export type AssetEncodingNoContent = Omit<AssetEncoding, 'content_chunks'>;

/**
 * @see EncodingType
 */
const EncodingTypeSchema = z.enum(['identity', 'gzip', 'compress', 'deflate', 'br']);

/**
 * A string identifier representing a specific encoding format (e.g., "gzip", "identity").
 */
export type EncodingType = 'identity' | 'gzip' | 'compress' | 'deflate' | 'br';

/**
 * @see Asset
 */
export const AssetSchema = z
  .object({
    key: AssetKeySchema,
    headers: HeaderFieldsSchema,
    encodings: z.array(z.tuple([EncodingTypeSchema, AssetEncodingSchema])),
    created_at: TimestampSchema,
    updated_at: TimestampSchema,
    version: VersionSchema.optional()
  })
  .strict();

/**
 * A stored asset including its metadata, encodings, and timestamps.
 */
export interface Asset {
  /**
   * Metadata about the asset's identity and ownership.
   */
  key: AssetKey;

  /**
   * Optional HTTP headers associated with the asset.
   */
  headers: HeaderField[];

  /**
   * A mapping from encoding types (e.g., "identity", "gzip") to the corresponding encoded version.
   */
  encodings: [EncodingType, AssetEncoding][];

  /**
   * Timestamp when the asset was created.
   */
  created_at: Timestamp;

  /**
   * Timestamp when the asset was last updated.
   */
  updated_at: Timestamp;

  /**
   * Optional version number of the asset.
   */
  version?: Version;
}

/**
 * @see AssetNoContent
 */
export const AssetNoContentSchema = AssetSchema.omit({encodings: true})
  .extend({
    encodings: z.array(z.tuple([EncodingTypeSchema, AssetEncodingNoContentSchema]))
  })
  .strict();

/**
 * A stored asset including its metadata, encodings without chunks, and timestamps.
 */
export type AssetNoContent = Omit<Asset, 'encodings'> & {
  encodings: [EncodingType, AssetEncodingNoContent][];
};

/**
 * @see ReferenceId
 */
const ReferenceIdSchema = z.bigint();

/**
 * A unique reference identifier for batches.
 */
export type ReferenceId = bigint;

/**
 * @see Batch
 */
export const BatchSchema = z
  .object({
    key: AssetKeySchema,
    reference_id: ReferenceIdSchema.optional(),
    expires_at: TimestampSchema,
    encoding_type: EncodingTypeSchema.optional()
  })
  .strict();

/**
 * Represents a batch of chunks to be uploaded and committed to an asset.
 */
export interface Batch {
  /**
   * The metadata key for the asset being uploaded.
   */
  key: AssetKey;

  /**
   * Optional reference ID for tracking or validation.
   */
  reference_id?: ReferenceId;

  /**
   * Timestamp when this batch expires.
   */
  expires_at: Timestamp;

  /**
   * Optional encoding format (e.g., "gzip").
   */
  encoding_type?: EncodingType;
}

/**
 * @see ChunkId
 */
const ChunkIdSchema = z.bigint();

/**
 * A unique identifier representing a single chunk of data.
 */
export type ChunkId = bigint;

/**
 * @see BatchId
 */
const BatchIdSchema = z.bigint();

/**
 * A unique identifier representing a batch of upload.
 */
export type BatchId = bigint;

/**
 * @see CommitBatch
 */
export const CommitBatchSchema = z
  .object({
    batch_id: BatchIdSchema,
    headers: HeaderFieldsSchema,
    chunk_ids: z.array(ChunkIdSchema)
  })
  .strict();

/**
 * Represents the final step in uploading an asset, committing the batch to storage.
 */
export interface CommitBatch {
  /**
   * The ID of the batch being committed.
   */
  batch_id: BatchId;

  /**
   * HTTP headers associated with this asset.
   */
  headers: HeaderField[];

  /**
   * List of chunk IDs that make up the asset content.
   */
  chunk_ids: ChunkId[];
}

/**
 * @see FullPath
 */
export const FullPathSchema = z.string();

/**
 * Represents the relative path of an asset in storage.
 * For assets that are not part of the frontend app, the collection must be included at the root of the path.
 *
 * Example: `/images/a-sun-above-the-mountains.png`
 */
export type FullPath = string;

/**
 * @see OptionAsset
 */
export const OptionAssetSchema = AssetSchema.optional();

/**
 * A shorthand for an asset that might or not be defined.
 */
export type OptionAsset = Asset | undefined;
