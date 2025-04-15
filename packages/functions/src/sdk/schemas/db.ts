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
 * @see DocStoreParams
 */
export const DocStoreParamsSchema = z
  .object({
    caller: RawUserIdSchema.or(UserIdSchema),
    collection: CollectionSchema,
    key: KeySchema
  })
  .strict();

/**
 * Represents the base parameters required to access the datastore and modify a document.
 */
export interface DocStoreParams {
  /**
   * The caller who initiate the document operation.
   */
  caller: RawUserId | UserId;

  /**
   * The name of the collection where the document is stored.
   */
  collection: Collection;

  /**
   * The key identifying the document within the collection.
   */
  key: Key;
}

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
export const ListDocStoreParamsSchema = z
  .object({
    caller: RawUserIdSchema.or(UserIdSchema),
    collection: CollectionSchema,
    params: ListParamsSchema
  })
  .strict();

/**
 * The parameters required to list documents from the datastore.
 */
export interface ListDocStoreParams {
  /**
   * The identity of the caller requesting the list operation.
   */
  caller: RawUserId | UserId;

  /**
   * The name of the collection to query.
   */
  collection: Collection;

  /**
   * Optional filtering, ordering, and pagination parameters.
   */
  params: ListParams;
}

/**
 * @see CountCollectionDocsStoreParams
 */
export const CountCollectionDocsStoreParamsSchema = z
  .object({
    collection: CollectionSchema
  })
  .strict();

/**
 * The parameters required to count documents of a collection from the datastore.
 */
export interface CountCollectionDocsStoreParams {
  /**
   * The name of the collection to query.
   */
  collection: Collection;
}

/**
 * @see ListDocStoreParams
 */
export const CountDocsStoreParamsSchema = ListDocStoreParamsSchema;

/**
 * The parameters required to count documents from the datastore.
 */
export type CountDocsStoreParams = ListDocStoreParams;
