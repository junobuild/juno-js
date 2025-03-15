import {jsonReplacer, jsonReviver} from '@dfinity/utils';
import type {RawData} from '../hooks/core';

/**
 * Decodes the raw data of a document into a JavaScript object.
 *
 * @template T The expected type of the decoded object.
 * @param {RawData} data - The raw data to be decoded.
 * @returns {T} The parsed JavaScript object.
 */
export const decodeDocData = <T>(data: RawData): T =>
  JSON.parse(__juno_satellite_datastore_raw_data_to_text(data), jsonReviver);

/**
 * Encodes a JavaScript object into a raw data format to be applied to a document.
 *
 * @template T The type of the object to be encoded.
 * @param {T} data - The data to be encoded.
 * @returns {RawData} The serialized raw data.
 */
export const encodeDocData = <T>(data: T): RawData =>
  __juno_satellite_datastore_raw_data_from_text(JSON.stringify(data, jsonReplacer));
