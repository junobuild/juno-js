import * as z from 'zod';
import {type SetDoc, SetDocSchema} from '../../schemas/db';
import {
  type Collection,
  CollectionSchema,
  type Key,
  KeySchema,
  type RawUserId,
  RawUserIdSchema,
  type UserId,
  UserIdSchema
} from '../../schemas/satellite';

/**
 * @see SetDocStoreParams
 */
export const SetDocStoreParamsSchema = z
  .object({
    caller: RawUserIdSchema.or(UserIdSchema),
    collection: CollectionSchema,
    key: KeySchema,
    doc: SetDocSchema
  })
  .strict();

/**
 * Represents the parameters required to store or update a document.
 *
 * This includes the document data along with metadata such as the caller,
 * collection, and key.
 */
export interface SetDocStoreParams {
  /**
   * The caller who initiate the document operation.
   */
  caller: RawUserId | UserId;

  /**
   * The name of the collection where the document is stored.
   */
  collection: Collection;

  /**
   * The unique key identifying the document within the collection.
   */
  key: Key;

  /**
   * The data, optional description and version required to create or update a document.
   */
  doc: SetDoc;
}
