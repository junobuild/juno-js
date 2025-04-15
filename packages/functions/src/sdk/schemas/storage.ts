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
