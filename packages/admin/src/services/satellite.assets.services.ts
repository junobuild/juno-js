import {countAssets as countAssetsApi, deleteAssets as deleteAssetsApi} from '../api/satellite.api';
import type {SatelliteParameters} from '../types/actor';

/**
 * Counts the assets in a collection.
 * @param {Object} params - The parameters for counting the assets.
 * @param {string} params.collection - The name of the collection.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<bigint>} A promise that resolves to the number of assets in the collection.
 */
export const countAssets = (params: {
  collection: string;
  satellite: SatelliteParameters;
}): Promise<bigint> => countAssetsApi(params);

/**
 * Deletes the assets in a collection.
 * @param {Object} params - The parameters for deleting the assets.
 * @param {string} params.collection - The name of the collection.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<void>} A promise that resolves when the assets are deleted.
 */
export const deleteAssets = (params: {
  collection: string;
  satellite: SatelliteParameters;
}): Promise<void> => deleteAssetsApi(params);
