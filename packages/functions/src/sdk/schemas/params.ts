import * as z from 'zod';
import {type ListParams, ListParamsSchema} from '../../schemas/list';
import {
  type Collection,
  CollectionSchema,
  type RawUserId,
  RawUserIdSchema,
  type UserId,
  UserIdSchema
} from '../../schemas/satellite';

/**
 * @see CollectionParams
 */
export const CollectionParamsSchema = z
  .object({
    collection: CollectionSchema
  })
  .strict();

/**
 * The parameters required to scope an operation to a collection.
 */
export interface CollectionParams {
  /**
   * The name of the collection to target.
   */
  collection: Collection;
}

/**
 * @see ListStoreParams
 */
export const ListStoreParamsSchema = CollectionParamsSchema.extend({
  caller: RawUserIdSchema.or(UserIdSchema),
  params: ListParamsSchema
}).strict();

/**
 * The parameters required to list documents from the datastore respectively assets from the storage.
 */
export type ListStoreParams = CollectionParams & {
  /**
   * The identity of the caller requesting the list operation.
   */
  caller: RawUserId | UserId;

  /**
   * Optional filtering, ordering, and pagination parameters.
   */
  params: ListParams;
};
