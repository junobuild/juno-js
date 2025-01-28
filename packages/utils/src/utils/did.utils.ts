import {jsonReplacer, jsonReviver} from '@dfinity/utils';

/**
 * Converts data to a Uint8Array for transmission or storage.
 * @template T
 * @param {T} data - The data to convert.
 * @returns {Promise<Uint8Array>} A promise that resolves to a Uint8Array representation of the data.
 */
export const toArray = async <T>(data: T): Promise<Uint8Array> => {
  const blob: Blob = new Blob([JSON.stringify(data, jsonReplacer)], {
    type: 'application/json; charset=utf-8'
  });
  return new Uint8Array(await blob.arrayBuffer());
};

/**
 * Converts a Uint8Array or number array back to the original data type.
 * @template T
 * @param {(Uint8Array | number[])} data - The array to convert.
 * @returns {Promise<T>} A promise that resolves to the original data.
 */
export const fromArray = async <T>(data: Uint8Array | number[]): Promise<T> => {
  const blob: Blob = new Blob([data instanceof Uint8Array ? data : new Uint8Array(data)], {
    type: 'application/json; charset=utf-8'
  });
  return JSON.parse(await blob.text(), jsonReviver);
};
