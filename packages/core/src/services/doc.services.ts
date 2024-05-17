import {
  deleteDoc as deleteDocApi,
  deleteManyDocs as deleteManyDocsApi,
  getDoc as getDocApi,
  getManyDocs as getManyDocsApi,
  listDocs as listDocsApi,
  setDoc as setDocApi,
  setManyDocs as setManyDocsApi
} from '../api/doc.api';
import type {Doc} from '../types/doc.types';
import type {ListParams, ListResults} from '../types/list.types';
import type {SatelliteOptions} from '../types/satellite.types';
import {getIdentity} from './identity.services';

/**
 * Retrieves a single document from a collection.
 * @template D
 * @param {Object} params - The parameters for retrieving the document.
 * @param {string} params.collection - The name of the collection.
 * @param {SatelliteOptions} [params.satellite] - Options for the satellite (useful for NodeJS usage only).
 * @param {string} params.key - The key of the document to retrieve.
 * @returns {Promise<Doc<D> | undefined>} A promise that resolves to the document or undefined if not found.
 */
export const getDoc = async <D>({
  satellite,
  ...rest
}: {
  collection: string;
  satellite?: SatelliteOptions;
} & Pick<Doc<D>, 'key'>): Promise<Doc<D> | undefined> => {
  const identity = getIdentity(satellite?.identity);

  return getDocApi({...rest, satellite: {...satellite, identity}});
};

/**
 * Retrieves multiple documents from a single or different collections in a single call.
 * @param {Object} params - The parameters for retrieving the documents.
 * @param {Array} params.docs - The list of documents with their collections and keys.
 * @param {SatelliteOptions} [params.satellite] - Options for the satellite (useful for NodeJS usage only).
 * @returns {Promise<Array<Doc<any> | undefined>>} A promise that resolves to an array of documents or undefined if not found.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getManyDocs = async ({
  satellite,
  ...rest
}: {
  docs: ({collection: string} & Pick<Doc<any>, 'key'>)[];
  satellite?: SatelliteOptions;
}): Promise<(Doc<any> | undefined)[]> => {
  const identity = getIdentity(satellite?.identity);

  return getManyDocsApi({...rest, satellite: {...satellite, identity}});
};
/* eslint-enable */

/**
 * Adds or updates a single document in a collection.
 * @template D
 * @param {Object} params - The parameters for adding or updating the document.
 * @param {string} params.collection - The name of the collection.
 * @param {Doc<D>} params.doc - The document to add or update.
 * @param {SatelliteOptions} [params.satellite] - Options for the satellite (useful for NodeJS usage only).
 * @returns {Promise<Doc<D>>} A promise that resolves to the added or updated document.
 */
export const setDoc = async <D>({
  satellite,
  ...rest
}: {
  collection: string;
  doc: Doc<D>;
  satellite?: SatelliteOptions;
}): Promise<Doc<D>> => {
  const identity = getIdentity(satellite?.identity);

  return setDocApi({...rest, satellite: {...satellite, identity}});
};

/**
 * Adds or updates multiple documents in a or different collections.
 * @param {Object} params - The parameters for adding or updating the documents.
 * @param {Array} params.docs - The list of documents with their collections and data.
 * @param {SatelliteOptions} [params.satellite] - Options for the satellite (useful for NodeJS usage only).
 * @returns {Promise<Array<Doc<any>>>} A promise that resolves to an array of added or updated documents.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const setManyDocs = async ({
  satellite,
  ...rest
}: {
  docs: {collection: string; doc: Doc<any>}[];
  satellite?: SatelliteOptions;
}): Promise<Doc<any>[]> => {
  const identity = getIdentity(satellite?.identity);

  return setManyDocsApi({...rest, satellite: {...satellite, identity}});
};
/* eslint-enable */

/**
 * Deletes a single document from a collection.
 * @template D
 * @param {Object} params - The parameters for deleting the document.
 * @param {string} params.collection - The name of the collection.
 * @param {Doc<D>} params.doc - The document to delete.
 * @param {SatelliteOptions} [params.satellite] - Options for the satellite (useful for NodeJS usage only).
 * @returns {Promise<void>} A promise that resolves when the document is deleted.
 */
export const deleteDoc = async <D>({
  satellite,
  ...rest
}: {
  collection: string;
  doc: Doc<D>;
  satellite?: SatelliteOptions;
}): Promise<void> => {
  const identity = getIdentity(satellite?.identity);

  return deleteDocApi({...rest, satellite: {...satellite, identity}});
};

/**
 * Deletes multiple documents from a or different collections.
 * @param {Object} params - The parameters for deleting the documents.
 * @param {Array} params.docs - The list of documents with their collections and data.
 * @param {SatelliteOptions} [params.satellite] - Options for the satellite (useful for NodeJS usage only).
 * @returns {Promise<void>} A promise that resolves when the documents are deleted.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const deleteManyDocs = async ({
  satellite,
  ...rest
}: {
  docs: {collection: string; doc: Doc<any>}[];
  satellite?: SatelliteOptions;
}): Promise<void> => {
  const identity = getIdentity(satellite?.identity);

  return deleteManyDocsApi({...rest, satellite: {...satellite, identity}});
};
/* eslint-enable */

/**
 * Lists documents in a collection with optional filtering.
 * @template D
 * @param {Object} params - The parameters for listing the documents.
 * @param {string} params.collection - The name of the collection.
 * @param {ListParams} [params.filter] - Optional filter parameters.
 * @param {SatelliteOptions} [params.satellite] - Options for the satellite (useful for NodeJS usage only).
 * @returns {Promise<ListResults<Doc<D>>>} A promise that resolves to the list of documents.
 */
export const listDocs = async <D>({
  satellite,
  filter,
  ...rest
}: {
  collection: string;
  filter?: ListParams;
  satellite?: SatelliteOptions;
}): Promise<ListResults<Doc<D>>> => {
  const identity = getIdentity(satellite?.identity);

  return listDocsApi<D>({...rest, filter: filter ?? {}, satellite: {...satellite, identity}});
};
