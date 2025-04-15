import {type DelDoc, DelDocSchema, type SetDoc, SetDocSchema} from '../../schemas/db';
import {
  type Key,
  KeySchema,
  type RawUserId,
  RawUserIdSchema,
  type UserId,
  UserIdSchema
} from '../../schemas/satellite';
import {
  type CollectionParams,
  CollectionParamsSchema,
  type ListStoreParams,
  ListStoreParamsSchema
} from './params';

/**
 * @see GetDocStoreParams
 */
export const GetDocStoreParamsSchema = CollectionParamsSchema.extend({
  caller: RawUserIdSchema.or(UserIdSchema),
  key: KeySchema
}).strict();

/**
 * Represents the base parameters required to access the datastore and modify a document.
 */
export type GetDocStoreParams = CollectionParams & {
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
export const SetDocStoreParamsSchema = GetDocStoreParamsSchema.extend({
  doc: SetDocSchema
}).strict();

/**
 * Represents the parameters required to store or update a document.
 *
 * This includes the document data along with metadata such as the caller,
 * collection, and key.
 */
export type SetDocStoreParams = GetDocStoreParams & {
  /**
   * The data, optional description and version required to create or update a document.
   */
  doc: SetDoc;
};

/**
 * @see DeleteDocStoreParams
 */
export const DeleteDocStoreParamsSchema = GetDocStoreParamsSchema.extend({
  doc: DelDocSchema
}).strict();

/**
 * Represents the parameters required to delete a document.
 *
 * This includes the document version along with metadata such as the caller,
 * collection, and key.
 */
export type DeleteDocStoreParams = GetDocStoreParams & {
  /**
   * The version required to delete a document.
   */
  doc: DelDoc;
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
 * @see ListDocsStoreParams
 */
export const ListDocsStoreParamsSchema = ListStoreParamsSchema;

/**
 * The parameters required to list documents from the datastore.
 */
export type ListDocsStoreParams = ListStoreParams;

/**
 * @see CountDocsStoreParams
 */
export const CountDocsStoreParamsSchema = ListStoreParamsSchema;

/**
 * The parameters required to count documents from the datastore.
 */
export type CountDocsStoreParams = ListStoreParams;

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
export const DeleteFilteredDocsStoreParamsSchema = ListStoreParamsSchema;

/**
 * The parameters required to delete documents from the datastore.
 */
export type DeleteFilteredDocsStoreParams = ListStoreParams;
