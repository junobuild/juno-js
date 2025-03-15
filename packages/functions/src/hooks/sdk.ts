import * as z from 'zod';
import {CollectionSchema, KeySchema, RawDataSchema, RawUserIdSchema, VersionSchema} from './core';
import {DocDescriptionSchema} from './datastore';

/**
 * @see SetDoc
 */
export const SetDocSchema = z
  .object({
    /**
     * The raw data of the document.
     */
    data: RawDataSchema,

    /**
     * An optional description of the document.
     */
    description: DocDescriptionSchema.optional(),

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
export const SetDocStoreParamsSchema = SetDocSchema.extend({
  /**
   * The caller who initiate the document operation.
   */
  caller: RawUserIdSchema,

  /**
   * The name of the collection where the document is stored.
   */
  collection: CollectionSchema,

  /**
   * The unique key identifying the document within the collection.
   */
  key: KeySchema
}).strict();

/**
 * Represents the parameters required to store or update a document.
 *
 * This includes the document data along with metadata such as the caller,
 * collection, and key.
 */
export type SetDocStoreParams = z.infer<typeof SetDocStoreParamsSchema>;
