import type {DocContext} from '../hooks/schemas/db/context';
import type {DocUpsert} from '../hooks/schemas/db/payload';
import type {Doc, OptionDoc} from '../schemas/db';
import type {ListResults} from '../schemas/list';
import {
  type DeleteDocStoreParams,
  type DocStoreParams,
  type ListDocStoreParams,
  type SetDocStoreParams,
  DeleteDocStoreParamsSchema,
  DocStoreParamsSchema,
  ListDocStoreParamsSchema,
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
 * @param {DocStoreParams} params - The parameters required to get the document.
 *
 * @returns {OptionDoc} The document if found, or undefined if not.
 *
 * @throws {z.ZodError} If the provided parameters do not match the expected schema.
 * @throws {Error} If the Satellite fails while retrieving the document.
 */
export const getDocStore = (params: DocStoreParams): OptionDoc => {
  DocStoreParamsSchema.parse(params);

  const {caller: providedCaller, collection, key} = params;

  const caller = normalizeCaller(providedCaller);

  return __juno_satellite_datastore_get_doc_store(caller, collection, key);
};

/**
 * Lists documents from the datastore using optional filtering, pagination, and ordering parameters.
 *
 * This function validates the input against the `ListDocStoreParamsSchema`, normalizes the caller identity,
 * and delegates the listing operation to the Satellite implementation.
 *
 * @param {ListDocStoreParams} params - The parameters required to perform the list operation.
 * @param {RawUserId | UserId} params.caller - The identity of the caller requesting the list.
 * @param {Collection} params.collection - The name of the collection to query.
 * @param {ListParams} params.params - Optional filtering, ordering, and pagination parameters.
 *
 * @returns {ListResults<Doc>} A list result containing matching documents and pagination metadata.
 *
 * @throws {z.ZodError} If the input parameters do not conform to the schema.
 * @throws {Error} If the Satellite fails while performing the listing operation.
 */
export const listDocsStore = (params: ListDocStoreParams): ListResults<Doc> => {
  ListDocStoreParamsSchema.parse(params);

  const {caller: providedCaller, collection, params: listParams} = params;

  const caller = normalizeCaller(providedCaller);

  return __juno_satellite_datastore_list_docs_store(caller, collection, listParams);
};
