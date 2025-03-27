import {Principal} from '@dfinity/principal';
import {SetDocStoreParams, SetDocStoreParamsSchema} from './schemas/db';

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

  const caller =
    providedCaller instanceof Principal ? providedCaller.toUint8Array() : providedCaller;

  __juno_satellite_datastore_set_doc_store(caller, collection, key, doc);
};
