import type {SatelliteParameters} from '@junobuild/ic-client';
import {countDocs as countDocsApi, deleteDocs as deleteDocsApi} from '../api/satellite.api';

/**
 * Counts the documents in a collection.
 * @param {Object} params - The parameters for counting the documents.
 * @param {string} params.collection - The name of the collection.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<bigint>} A promise that resolves to the number of documents in the collection.
 */
export const countDocs = (params: {
  collection: string;
  satellite: SatelliteParameters;
}): Promise<bigint> => countDocsApi(params);

/**
 * Deletes the documents in a collection.
 * @param {Object} params - The parameters for deleting the documents.
 * @param {string} params.collection - The name of the collection.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<void>} A promise that resolves when the documents are deleted.
 */
export const deleteDocs = (params: {
  collection: string;
  satellite: SatelliteParameters;
}): Promise<void> => deleteDocsApi(params);
