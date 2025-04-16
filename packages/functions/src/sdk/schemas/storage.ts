import * as z from 'zod';
import {
  type AssetKey,
  type Blob,
  type HeaderFields,
  AssetKeySchema,
  BlobSchema,
  HeaderFieldsSchema
} from '../../schemas/storage';
import {
  type CollectionParams,
  type ListStoreParams,
  CollectionParamsSchema,
  ListStoreParamsSchema
} from './params';

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
