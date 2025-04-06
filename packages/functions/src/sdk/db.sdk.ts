import {
  type DeleteDocStoreParams,
  type SetDocStoreParams,
  DeleteDocStoreParamsSchema,
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
 * @throws {z.ZodError} If the provided parameters do not match the expected schema.
 * @throws {Error} If the Satellite fails at validating the submitted document before storing it.
 */
export const setDocStore = (params: SetDocStoreParams) => {
  SetDocStoreParamsSchema.parse(params);

  const {caller: providedCaller, collection, key, doc} = params;

  const caller = normalizeCaller(providedCaller);

  __juno_satellite_datastore_set_doc_store(caller, collection, key, doc);
};

/**
 * Delete a document in the datastore.
 *
 * @param {DeleteDocStoreParams} params - The parameters required to delete the document,
 * including the caller, collection, key, and version of the document.
 *
 * @throws {z.ZodError} If the provided parameters do not match the expected schema.
 * @throws {Error} If the Satellite fails at validating the submitted request before deleting it.
 */
export const deleteDocStore = (params: DeleteDocStoreParams) => {
  DeleteDocStoreParamsSchema.parse(params);

  const {caller: providedCaller, collection, key, doc} = params;

  const caller = normalizeCaller(providedCaller);

  __juno_satellite_datastore_delete_doc_store(caller, collection, key, doc);
};
