import {jsonReplacer, jsonReviver} from '@dfinity/utils';
import type {RawData} from '../hooks/core';

export const decodeDocData = <T>(data: RawData): T =>
  JSON.parse(__juno_satellite_datastore_raw_data_to_text(data), jsonReviver);

export const encodeDocData = <T>(data: T): RawData =>
  __juno_satellite_datastore_raw_data_from_text(JSON.stringify(data, jsonReplacer));
