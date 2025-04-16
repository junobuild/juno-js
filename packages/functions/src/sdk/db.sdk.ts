import type {DocContext} from '../hooks/schemas/db/context';
import type {DocUpsert} from '../hooks/schemas/db/payload';
import type {Doc, OptionDoc} from '../schemas/db';
import type {ListResults} from '../schemas/list';
import {
  type CountCollectionDocsStoreParams,
  CountCollectionDocsStoreParamsSchema,
  type CountDocsStoreParams,
  CountDocsStoreParamsSchema,
  type DeleteDocsStoreParams,
  DeleteDocsStoreParamsSchema,
  type DeleteDocStoreParams,
  DeleteDocStoreParamsSchema,
  type DeleteFilteredDocsStoreParams,
  DeleteFilteredDocsStoreParamsSchema,
  type GetDocStoreParams,
  GetDocStoreParamsSchema,
  type ListDocsStoreParams,
  ListDocsStoreParamsSchema,
  type SetDocStoreParams,
  SetDocStoreParamsSchema
} from './schemas/db';
import {normalizeCaller} from './utils/caller.utils';

/**
 * Stores or updates a document in the datastore.
 *
 * The data must have been encoded - using encodeDocData - before calling this function.
 *
 * @param {SetDocStoreParams} params - The parameters required to store the document,
 * including the caller, collection, key, and document data.
 *
 * @returns {DocContext<DocUpsert>} The context of the stored or updated document,
 * including its key, collection, and both the previous and current versions of the document.
 *
 * @throws {z.ZodError} If the provided parameters do not match the expected schema.
 * @throws {Error} If the Satellite fails to validate or store the document.
 */
export const setDocStore = (params: SetDocStoreParams): DocContext<DocUpsert> => {
  SetDocStoreParamsSchema.parse(params);

  const {caller: providedCaller, collection, key, doc} = params;

  const caller = normalizeCaller(providedCaller);

  return __juno_satellite_datastore_set_doc_store(caller, collection, key, doc);
};

/**
 * Deletes a document from the datastore.
 *
 * @param {DeleteDocStoreParams} params - The parameters required to delete the document,
 * including the caller, collection, key, and the expected version of the document.
 *
 * @returns {DocContext<OptionDoc>} The context of the deleted document,
 * including its key, collection, and optionally the previous document data if it existed.
 *
 * @throws {z.ZodError} If the provided parameters do not match the expected schema.
 * @throws {Error} If the Satellite fails to validate the request or the document cannot be deleted.
 */
export const deleteDocStore = (params: DeleteDocStoreParams): DocContext<OptionDoc> => {
  DeleteDocStoreParamsSchema.parse(params);

  const {caller: providedCaller, collection, key, doc} = params;

  const caller = normalizeCaller(providedCaller);

  return __juno_satellite_datastore_delete_doc_store(caller, collection, key, doc);
};

/**
 * Retrieve a document from the datastore.
 *
 * @param {GetDocStoreParams} params - The parameters required to get the document.
 *
 * @returns {OptionDoc} The document if found, or undefined if not.
 *
 * @throws {z.ZodError} If the provided parameters do not match the expected schema.
 * @throws {Error} If the Satellite fails while retrieving the document.
 */
export const getDocStore = (params: GetDocStoreParams): OptionDoc => {
  GetDocStoreParamsSchema.parse(params);

  const {caller: providedCaller, collection, key} = params;

  const caller = normalizeCaller(providedCaller);

  return __juno_satellite_datastore_get_doc_store(caller, collection, key);
};

/**
 * Lists documents from the datastore using optional filtering, pagination, and ordering parameters.
 *
 * @param {ListStoreParams} params - The parameters required to perform the list operation.
 *
 * @returns {ListResults<Doc>} A list result containing matching documents and pagination metadata.
 *
 * @throws {z.ZodError} If the input parameters do not conform to the schema.
 * @throws {Error} If the Satellite fails while performing the listing operation.
 */
export const listDocsStore = (params: ListDocsStoreParams): ListResults<Doc> => {
  ListDocsStoreParamsSchema.parse(params);

  const {caller: providedCaller, collection, params: listParams} = params;

  const caller = normalizeCaller(providedCaller);

  return __juno_satellite_datastore_list_docs_store(caller, collection, listParams);
};

/**
 * Counts the number of documents in a specific collection.
 *
 * @param {CountCollectionDocsStoreParams} params - The parameters required to count documents in the collection.
 *
 * @returns {bigint} The total number of documents in the specified collection.
 *
 * @throws {z.ZodError} If the input parameters do not conform to the schema.
 * @throws {Error} If the Satellite fails while performing the count operation.
 */
export const countCollectionDocsStore = (params: CountCollectionDocsStoreParams): bigint => {
  CountCollectionDocsStoreParamsSchema.parse(params);

  const {collection} = params;

  return __juno_satellite_datastore_count_collection_docs_store(collection);
};

/**
 * Counts the number of documents in a collection matching specific filters and owned by a specific caller.
 *
 * @param {CountDocsStoreParams} params - The parameters required to perform the filtered count.
 *
 * @returns {bigint} The number of documents that match the provided filters.
 *
 * @throws {z.ZodError} If the input parameters do not conform to the schema.
 * @throws {Error} If the Satellite fails while performing the count operation.
 */
export const countDocsStore = (params: CountDocsStoreParams): bigint => {
  CountDocsStoreParamsSchema.parse(params);

  const {caller: providedCaller, collection, params: listParams} = params;

  const caller = normalizeCaller(providedCaller);

  return __juno_satellite_datastore_count_docs_store(caller, collection, listParams);
};

/**
 * Delete documents in a specific collection of the Datastore.
 *
 * @param {DeleteDocsStoreParams} params - The parameters required to delete documents in the collection.
 *
 * @throws {z.ZodError} If the input parameters do not conform to the schema.
 * @throws {Error} If the Satellite fails while performing the count operation.
 */
export const deleteDocsStore = (params: DeleteDocsStoreParams): void => {
  DeleteDocsStoreParamsSchema.parse(params);

  const {collection} = params;

  __juno_satellite_datastore_delete_docs_store(collection);
};

/**
 * Delete documents in a collection matching specific filters and owned by a specific caller.
 *
 * @param {DeleteFilteredDocsStoreParams} params - The parameters required to perform the filtered deletion.
 *
 * @returns {DocContext<OptionDoc>[]} The context resulting of the deletion of documents that match the provided filters.
 *
 * @throws {z.ZodError} If the input parameters do not conform to the schema.
 * @throws {Error} If the Satellite fails while performing the count operation.
 */
export const deleteFilteredDocsStore = (
  params: DeleteFilteredDocsStoreParams
): DocContext<OptionDoc>[] => {
  DeleteFilteredDocsStoreParamsSchema.parse(params);

  const {caller: providedCaller, collection, params: listParams} = params;

  const caller = normalizeCaller(providedCaller);

  return __juno_satellite_datastore_delete_filtered_docs_store(caller, collection, listParams);
};
