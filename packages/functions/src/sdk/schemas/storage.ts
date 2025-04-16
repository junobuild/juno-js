import * as z from 'zod';
import {type RawUserId, type UserId, RawUserIdSchema, UserIdSchema} from '../../schemas/satellite';
import {
  type AssetKey,
  type Blob,
  type FullPath,
  type HeaderFields,
  AssetKeySchema,
  BlobSchema,
  FullPathSchema,
  HeaderFieldsSchema
} from '../../schemas/storage';
import {
  type CollectionParams,
  type ListStoreParams,
  CollectionParamsSchema,
  ListStoreParamsSchema
} from './params';

/**
 * @see GetAssetStoreParams
 */
export const GetAssetStoreParamsSchema = CollectionParamsSchema.extend({
  caller: RawUserIdSchema.or(UserIdSchema),
  full_path: FullPathSchema
}).strict();

/**
 * Represents the base parameters required to access the storage and modify an asset.
 */
export type GetAssetStoreParams = CollectionParams & {
  /**
   * The caller who initiate the document operation.
   */
  caller: RawUserId | UserId;

  /**
   * The full_path identifying the asset within the collection.
   */
  full_path: FullPath;
};

/**
 * @see CountCollectionAssetsStoreParams
 */
export const CountCollectionAssetsStoreParamsSchema = CollectionParamsSchema;

/**
 * The parameters required to count documents from the storage.
 */
export type CountCollectionAssetsStoreParams = CollectionParams;

/**
 * @see CountAssetsStoreParams
 */
export const CountAssetsStoreParamsSchema = ListStoreParamsSchema;

/**
 * The parameters required to count documents from the storage.
 */
export type CountAssetsStoreParams = ListStoreParams;

/**
 * @see SetAssetHandlerParams
 */
export const SetAssetHandlerParamsSchema = z
  .object({
    key: AssetKeySchema,
    content: BlobSchema,
    headers: HeaderFieldsSchema
  })
  .strict();

/**
 * The parameters required to set (or update) an asset.
 */
export interface SetAssetHandlerParams {
  /**
   * The key identifying the asset.
   */
  key: AssetKey;

  /**
   * The binary content of the asset.
   */
  content: Blob;

  /**
   * Associated HTTP headers.
   */
  headers: HeaderFields;
}

/**
 * @see DeleteAssetsStoreParams
 */
export const DeleteAssetsStoreParamsSchema = CollectionParamsSchema;

/**
 * The parameters required to delete the assets from a collection of the storage.
 */
export type DeleteAssetsStoreParams = CollectionParams;

/**
 * @see DeleteFilteredAssetsParams
 */
export const DeleteFilteredAssetsStoreParamsSchema = ListStoreParamsSchema;

/**
 * The parameters required to delete assets from the storage.
 */
export type DeleteFilteredAssetsStoreParams = ListStoreParams;

/**
 * @see DeleteAssetStoreParams
 */
export const DeleteAssetStoreParamsSchema = GetAssetStoreParamsSchema;

/**
 * Represents the parameters required to delete an asset.
 */
export type DeleteAssetStoreParams = GetAssetStoreParams;
