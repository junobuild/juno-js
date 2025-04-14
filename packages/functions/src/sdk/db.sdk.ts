import type {DocContext} from '../hooks/schemas/db/context';
import type {DocUpsert} from '../hooks/schemas/db/payload';
import type {OptionDoc} from '../schemas/db';
import {
  type DeleteDocStoreParams,
  type DocStoreParams,
  type SetDocStoreParams,
  DeleteDocStoreParamsSchema,
  DocStoreParamsSchema,
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
