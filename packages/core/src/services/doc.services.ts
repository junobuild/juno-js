import {
  countDocs as countDocsApi,
  deleteDoc as deleteDocApi,
  deleteFilteredDocs as deleteFilteredDocsApi,
  deleteManyDocs as deleteManyDocsApi,
  getDoc as getDocApi,
  getManyDocs as getManyDocsApi,
  listDocs as listDocsApi,
  setDoc as setDocApi,
  setManyDocs as setManyDocsApi
} from '../api/doc.api';
import {DEFAULT_READ_OPTIONS} from '../constants/call-options.constants';
import type {ReadOptions} from '../types/call-options';
import type {Doc} from '../types/doc';
import type {ListParams, ListResults} from '../types/list';
import type {SatelliteOptions} from '../types/satellite';
import {getAnyIdentity} from './identity.services';

/**
 * Retrieves a single document from a collection.
 * @template D
 * @param {Object} params - The parameters for retrieving the document.
 * @param {string} params.collection - The name of the collection.
 * @param {string} params.key - The key of the document to retrieve.
 * @param {SatelliteOptions} [params.satellite] - Options for the satellite (useful for NodeJS usage only).
 * @param {ReadOptions} [params.options] - Call options controlling certification. Defaults to uncertified reads for performance unless specified.
 * @returns {Promise<Doc<D> | undefined>} A promise that resolves to the document or undefined if not found.
 */
export const getDoc = async <D>({
  satellite,
  options,
  ...rest
}: {
  collection: string;
  satellite?: SatelliteOptions;
  options?: ReadOptions;
} & Pick<Doc<D>, 'key'>): Promise<Doc<D> | undefined> => {
  const identity = getAnyIdentity(satellite?.identity);

  return await getDocApi({
    ...rest,
    satellite: {...satellite, identity},
    options: options ?? DEFAULT_READ_OPTIONS
  });
};

/**
 * Retrieves multiple documents from a single or different collections in a single call.
 * @param {Object} params - The parameters for retrieving the documents.
 * @param {Array} params.docs - The list of documents with their collections and keys.
 * @param {SatelliteOptions} [params.satellite] - Options for the satellite (useful for NodeJS usage only).
 * @param {ReadOptions} [params.options] - Call options controlling certification. Defaults to uncertified reads for performance unless specified.
 * @returns {Promise<Array<Doc<any> | undefined>>} A promise that resolves to an array of documents or undefined if not found.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getManyDocs = async ({
  satellite,
  options,
  ...rest
}: {
  docs: ({collection: string} & Pick<Doc<any>, 'key'>)[];
  satellite?: SatelliteOptions;
  options?: ReadOptions;
}): Promise<(Doc<any> | undefined)[]> => {
  const identity = getAnyIdentity(satellite?.identity);

  return await getManyDocsApi({
    ...rest,
    satellite: {...satellite, identity},
    options: options ?? DEFAULT_READ_OPTIONS
  });
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
  const identity = getAnyIdentity(satellite?.identity);

  return await setDocApi({
    ...rest,
    satellite: {...satellite, identity},
    options: {certified: true}
  });
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
  const identity = getAnyIdentity(satellite?.identity);

  return await setManyDocsApi({
    ...rest,
    satellite: {...satellite, identity},
    options: {certified: true}
  });
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
  const identity = getAnyIdentity(satellite?.identity);

  return await deleteDocApi({
    ...rest,
    satellite: {...satellite, identity},
    options: {certified: true}
  });
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
  const identity = getAnyIdentity(satellite?.identity);

  return await deleteManyDocsApi({
    ...rest,
    satellite: {...satellite, identity},
    options: {certified: true}
  });
};
/* eslint-enable */

/**
 * Deletes documents from a collection with optional filtering.
 *
 * @param {Object} params - The parameters for deleting documents.
 * @param {string} params.collection - The name of the collection.
 * @param {ListParams} [params.filter] - The filter criteria to match documents for deletion.
 * @param {SatelliteOptions} [params.satellite] - Options for the satellite (useful for NodeJS usage only).
 *
 * @returns {Promise<void>} A promise that resolves when the documents are deleted.
 */
export const deleteFilteredDocs = async ({
  satellite,
  filter,
  ...rest
}: {
  collection: string;
  filter?: ListParams;
  satellite?: SatelliteOptions;
}): Promise<void> => {
  const identity = getAnyIdentity(satellite?.identity);

  return await deleteFilteredDocsApi({
    ...rest,
    filter: filter ?? {},
    satellite: {...satellite, identity},
    options: {certified: true}
  });
};

/**
 * Lists documents in a collection with optional filtering.
 * @template D
 * @param {Object} params - The parameters for listing the documents.
 * @param {string} params.collection - The name of the collection.
 * @param {ListParams} [params.filter] - Optional filter parameters.
 * @param {SatelliteOptions} [params.satellite] - Options for the satellite (useful for NodeJS usage only).
 * @param {ReadOptions} [params.options] - Call options controlling certification. Defaults to uncertified reads for performance unless specified.
 * @returns {Promise<ListResults<Doc<D>>>} A promise that resolves to the list of documents.
 */
export const listDocs = async <D>({
  satellite,
  options,
  filter,
  ...rest
}: {
  collection: string;
  filter?: ListParams;
  satellite?: SatelliteOptions;
  options?: ReadOptions;
}): Promise<ListResults<Doc<D>>> => {
  const identity = getAnyIdentity(satellite?.identity);

  return await listDocsApi<D>({
    ...rest,
    filter: filter ?? {},
    satellite: {...satellite, identity},
    options: options ?? DEFAULT_READ_OPTIONS
  });
};

/**
 * Counts documents in a collection with optional filtering.
 * @param {Object} params - The parameters for counting the documents.
 * @param {string} params.collection - The name of the collection.
 * @param {ListParams} [params.filter] - Optional filter parameters.
 * @param {SatelliteOptions} [params.satellite] - Options for the satellite (useful for NodeJS usage only).
 * @param {ReadOptions} [params.options] - Call options controlling certification. Defaults to uncertified reads for performance unless specified.
 * @returns {Promise<bigint>} A promise that resolves to the count of documents as a bigint.
 */
export const countDocs = async ({
  satellite,
  options,
  filter,
  ...rest
}: {
  collection: string;
  filter?: ListParams;
  satellite?: SatelliteOptions;
  options?: ReadOptions;
}): Promise<bigint> => {
  const identity = getAnyIdentity(satellite?.identity);

  return await countDocsApi({
    ...rest,
    filter: filter ?? {},
    satellite: {...satellite, identity},
    options: options ?? DEFAULT_READ_OPTIONS
  });
};
