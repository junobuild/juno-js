import {
  CountAssetsStoreParams,
  CountAssetsStoreParamsSchema,
  type CountCollectionAssetsStoreParams,
  CountCollectionAssetsStoreParamsSchema
} from './schemas/storage';
import {normalizeCaller} from './utils/caller.utils';

/**
 * Counts the number of assets in a specific collection.
 *
 * @param {CountCollectionAssetsStoreParams} params - The parameters required to count assets in the collection.
 *
 * @returns {bigint} The total number of assets in the specified collection.
 *
 * @throws {z.ZodError} If the input parameters do not conform to the schema.
 * @throws {Error} If the Satellite fails while performing the count operation.
 */
export const countCollectionAssetsStore = (params: CountCollectionAssetsStoreParams): bigint => {
  CountCollectionAssetsStoreParamsSchema.parse(params);

  const {collection} = params;

  return __juno_satellite_storage_count_collection_assets_store(collection);
};

/**
 * Counts the number of assets in a collection matching specific filters and owned by a specific caller.
 *
 * @param {CountAssetsStoreParams} params - The parameters required to perform the filtered count.
 *
 * @returns {bigint} The number of assets that match the provided filters.
 *
 * @throws {z.ZodError} If the input parameters do not conform to the schema.
 * @throws {Error} If the Satellite fails while performing the count operation.
 */
export const countAssetsStore = (params: CountAssetsStoreParams): bigint => {
  CountAssetsStoreParamsSchema.parse(params);

  const {caller: providedCaller, collection, params: listParams} = params;

  const caller = normalizeCaller(providedCaller);

  return __juno_satellite_storage_count_assets_store(caller, collection, listParams);
};
