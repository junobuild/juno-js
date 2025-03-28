import * as z from 'zod';
import {
    Collection,
    CollectionSchema, Description,
    DescriptionSchema, RawUserId,
    RawUserIdSchema, Timestamp,
    TimestampSchema, Version,
    VersionSchema
} from "./satellite";
import {Uint8ArraySchema} from "./candid";

/**
 * @see HeaderField
 */
const HeaderFieldSchema = z.tuple([z.string(), z.string()]);

/**
 * Represents a single HTTP header as a tuple of name and value.
 */
export type HeaderField = [string, string];

/**
 * @see Blob
 */
const BlobSchema = Uint8ArraySchema;

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
const HashSchema = z
    .instanceof(Uint8Array)
    .refine((val) => val.length === 32, {
        message: 'Hash must be a Uint8Array of length 32'
    });

/**
 * Represents a SHA-256 hash as a 32-byte binary value.
 */
export type Hash = Uint8Array;

/**
 * @see AssetKey
 */
const AssetKeySchema = z.object({
    name: z.string(),
    full_path: z.string(),
    token: z.string().optional(),
    collection: CollectionSchema,
    owner: RawUserIdSchema,
    description: DescriptionSchema.optional()
});

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
const AssetEncodingSchema = z.object({
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
 * @see Asset
 */
export const AssetSchema = z.object({
    key: AssetKeySchema,
    headers: z.array(HeaderFieldSchema),
    encodings: z.record(AssetEncodingSchema),
    created_at: TimestampSchema,
    updated_at: TimestampSchema,
    version: VersionSchema.optional()
}).strict();

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
    encodings: Record<string, AssetEncoding>;

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