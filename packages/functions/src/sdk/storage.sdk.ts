import type {ListResults} from '../schemas/list';
import type {AssetNoContent, Blob, OptionAsset} from '../schemas/storage';
import {
  type CountAssetsStoreParams,
  CountAssetsStoreParamsSchema,
  type CountCollectionAssetsStoreParams,
  CountCollectionAssetsStoreParamsSchema,
  type DeleteAssetsStoreParams,
  DeleteAssetsStoreParamsSchema,
  type DeleteAssetStoreParams,
  DeleteAssetStoreParamsSchema,
  type DeleteFilteredAssetsStoreParams,
  DeleteFilteredAssetsStoreParamsSchema,
  type GetAssetStoreParams,
  GetAssetStoreParamsSchema,
  type GetContentChunksStoreParams,
  GetContentChunksStoreParamsSchema,
  type ListAssetsStoreParams,
  ListAssetsStoreParamsSchema,
  type SetAssetHandlerParams,
  SetAssetHandlerParamsSchema
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

/**
 * Sets or updates an asset in the storage.
 *
 * @param {SetAssetHandlerParams} params - The parameters required to set or update an asset.
 *
 * @throws {z.ZodError} If the input parameters do not conform to the schema.
 * @throws {Error} If the Satellite fails while performing the operation.
 */
export const setAssetHandler = (params: SetAssetHandlerParams): void => {
  SetAssetHandlerParamsSchema.parse(params);

  const {key, content, headers} = params;

  __juno_satellite_storage_set_asset_handler(key, content, headers);
};

/**
 * Deletes an asset from the storage.
 *
 * @param {DeleteAssetStoreParams} params - The parameters required to delete the asset.
 *
 * @returns {OptionAsset} The potentially deleted asset.
 *
 * @throws {z.ZodError} If the provided parameters do not match the expected schema.
 * @throws {Error} If the Satellite fails to validate the request or the asset cannot be deleted.
 */
export const deleteAssetStore = (params: DeleteAssetStoreParams): OptionAsset => {
  DeleteAssetStoreParamsSchema.parse(params);

  const {caller: providedCaller, collection, full_path} = params;

  const caller = normalizeCaller(providedCaller);

  return __juno_satellite_storage_delete_asset_store(caller, collection, full_path);
};

/**
 * Delete assets in a specific collection of the Storage.
 *
 * @param {DeleteAssetsStoreParams} params - The parameters required to delete assets in the collection.
 *
 * @throws {z.ZodError} If the input parameters do not conform to the schema.
 * @throws {Error} If the Satellite fails while performing the count operation.
 */
export const deleteAssetsStore = (params: DeleteAssetsStoreParams): void => {
  DeleteAssetsStoreParamsSchema.parse(params);

  const {collection} = params;

  __juno_satellite_storage_delete_assets_store(collection);
};

/**
 * Delete assets in a collection matching specific filters and owned by a specific caller.
 *
 * @param {DeleteFilteredAssetsStoreParams} params - The parameters required to perform the filtered deletion.
 *
 * @returns {OptionAsset[]} The potential asset resulting of the deletion that match the provided filters.
 *
 * @throws {z.ZodError} If the input parameters do not conform to the schema.
 * @throws {Error} If the Satellite fails while performing the count operation.
 */
export const deleteFilteredAssetsStore = (
  params: DeleteFilteredAssetsStoreParams
): OptionAsset[] => {
  DeleteFilteredAssetsStoreParamsSchema.parse(params);

  const {caller: providedCaller, collection, params: listParams} = params;

  const caller = normalizeCaller(providedCaller);

  return __juno_satellite_storage_delete_filtered_assets_store(caller, collection, listParams);
};

/**
 * Retrieve an asset from the storage.
 *
 * @param {GetAssetStoreParams} params - The parameters required to get the asset.
 *
 * @returns {OptionAsset} The asset if found, or undefined if not.
 *
 * @throws {z.ZodError} If the provided parameters do not match the expected schema.
 * @throws {Error} If the Satellite fails while retrieving the document.
 */
export const getAssetStore = (params: GetAssetStoreParams): OptionAsset => {
  GetAssetStoreParamsSchema.parse(params);

  const {caller: providedCaller, collection, full_path} = params;

  const caller = normalizeCaller(providedCaller);

  return __juno_satellite_storage_get_asset_store(caller, collection, full_path);
};

/**
 * Lists assets (without content) from the storage using optional filtering, pagination, and ordering parameters.
 *
 * @param {ListStoreParams} params - The parameters required to perform the list operation.
 *
 * @returns {ListResults<AssetNoContent>} A list result containing matching assets and pagination metadata.
 *
 * @throws {z.ZodError} If the input parameters do not conform to the schema.
 * @throws {Error} If the Satellite fails while performing the listing operation.
 */
export const listAssetsStore = (params: ListAssetsStoreParams): ListResults<AssetNoContent> => {
  ListAssetsStoreParamsSchema.parse(params);

  const {caller: providedCaller, collection, params: listParams} = params;

  const caller = normalizeCaller(providedCaller);

  return __juno_satellite_storage_list_assets_store(caller, collection, listParams);
};

/**
 * Retrieves content chunks of an asset.
 *
 * This function fetches a content chunk of a given asset encoding using the specified parameters.
 *
 * @param {GetContentChunksStoreParams} params - The parameters including encoding, chunk index, and memory type.
 *
 * @returns {Blob | undefined} The content chunk if found, or `undefined` if not.
 *
 * @throws {z.ZodError} If the input parameters do not conform to the schema.
 * @throws {Error} If the Satellite throws an internal error during retrieval.
 */
export const getContentChunksStore = (params: GetContentChunksStoreParams): Blob | undefined => {
  GetContentChunksStoreParamsSchema.parse(params);

  const {encoding, chunk_index, memory} = params;

  return __juno_satellite_storage_get_content_chunks_store(encoding, chunk_index, memory);
};
