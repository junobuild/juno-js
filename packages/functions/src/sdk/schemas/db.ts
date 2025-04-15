import * as z from 'zod';
import {type DelDoc, DelDocSchema, type SetDoc, SetDocSchema} from '../../schemas/db';
import {type ListParams, ListParamsSchema} from '../../schemas/list';
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
 * @see DocStoreParams
 */
export const DocStoreParamsSchema = CollectionParamsSchema.extend({
  caller: RawUserIdSchema.or(UserIdSchema),
  key: KeySchema
}).strict();

/**
 * Represents the base parameters required to access the datastore and modify a document.
 */
export type DocStoreParams = CollectionParams & {
  /**
   * The caller who initiate the document operation.
   */
  caller: RawUserId | UserId;

  /**
   * The key identifying the document within the collection.
   */
  key: Key;
};

/**
 * @see SetDocStoreParams
 */
export const SetDocStoreParamsSchema = DocStoreParamsSchema.extend({
  doc: SetDocSchema
}).strict();

/**
 * Represents the parameters required to store or update a document.
 *
 * This includes the document data along with metadata such as the caller,
 * collection, and key.
 */
export type SetDocStoreParams = DocStoreParams & {
  /**
   * The data, optional description and version required to create or update a document.
   */
  doc: SetDoc;
};

/**
 * @see DeleteDocStoreParams
 */
export const DeleteDocStoreParamsSchema = DocStoreParamsSchema.extend({
  doc: DelDocSchema
}).strict();

/**
 * Represents the parameters required to delete a document.
 *
 * This includes the document version along with metadata such as the caller,
 * collection, and key.
 */
export type DeleteDocStoreParams = DocStoreParams & {
  /**
   * The version required to delete a document.
   */
  doc: DelDoc;
};

/**
 * @see ListDocStoreParams
 */
export const ListDocStoreParamsSchema = CollectionParamsSchema.extend({
  caller: RawUserIdSchema.or(UserIdSchema),
  params: ListParamsSchema
}).strict();

/**
 * The parameters required to list documents from the datastore.
 */
export type ListDocStoreParams = CollectionParams & {
  /**
   * The identity of the caller requesting the list operation.
   */
  caller: RawUserId | UserId;

  /**
   * Optional filtering, ordering, and pagination parameters.
   */
  params: ListParams;
};

/**
 * @see CountCollectionDocsStoreParams
 */
export const CountCollectionDocsStoreParamsSchema = CollectionParamsSchema;

/**
 * The parameters required to count documents from the datastore.
 */
export type CountCollectionDocsStoreParams = CollectionParams;

/**
 * @see CountDocsStoreParams
 */
export const CountDocsStoreParamsSchema = ListDocStoreParamsSchema;

/**
 * The parameters required to count documents from the datastore.
 */
export type CountDocsStoreParams = ListDocStoreParams;

/**
 * @see DeleteDocsStoreParams
 */
export const DeleteDocsStoreParamsSchema = CollectionParamsSchema;

/**
 * The parameters required to delete the documents from a of the datastore.
 */
export type DeleteDocsStoreParams = CollectionParams;

/**
 * @see DeleteFilteredDocsParams
 */
export const DeleteFilteredDocsStoreParamsSchema = ListDocStoreParamsSchema;

/**
 * The parameters required to delete documents from the datastore.
 */
export type DeleteFilteredDocsStoreParams = ListDocStoreParams;
