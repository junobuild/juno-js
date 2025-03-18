import * as z from 'zod';
import {DocDescriptionSchema, RawDataSchema} from '../../schemas/db';
import {
  CollectionSchema,
  KeySchema,
  RawUserIdSchema,
  UserIdSchema,
  VersionSchema
} from '../../schemas/satellite';

/**
 * @see SetDoc
 */
export const SetDocSchema = z
  .object({
    /**
     * The unique key identifying the document within the collection.
     */
    key: KeySchema,

    /**
     * An optional description of the document.
     */
    description: DocDescriptionSchema.optional(),

    /**
     * The raw data of the document.
     */
    data: RawDataSchema,

    /**
     * The expected version number to ensure consistency.
     * If provided, the operation will fail if the stored version does not match.
     */
    version: VersionSchema.optional()
  })
  .strict();

/**
 * Represents a request to set or update a document.
 *
 * This is used when submitting new document data.
 */
export type SetDoc = z.infer<typeof SetDocSchema>;

/**
 * @see SetDocStoreParams
 */
export const SetDocStoreParamsSchema = z
  .object({
    /**
     * The caller who initiate the document operation.
     */
    caller: RawUserIdSchema.or(UserIdSchema),

    /**
     * The name of the collection where the document is stored.
     */
    collection: CollectionSchema,

    /**
     * The data, key and other information required to create or update a document.
     */
    doc: SetDocSchema
  })
  .strict();

/**
 * Represents the parameters required to store or update a document.
 *
 * This includes the document data along with metadata such as the caller,
 * collection, and key.
 */
export type SetDocStoreParams = z.infer<typeof SetDocStoreParamsSchema>;
