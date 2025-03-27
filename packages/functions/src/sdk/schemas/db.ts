import * as z from 'zod';
import {SetDocSchema} from '../../hooks/schemas/db/payload';
import {CollectionSchema, KeySchema, RawUserIdSchema, UserIdSchema} from '../../schemas/satellite';

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
     * The unique key identifying the document within the collection.
     */
    key: KeySchema,

    /**
     * The data, optional description and version required to create or update a document.
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
