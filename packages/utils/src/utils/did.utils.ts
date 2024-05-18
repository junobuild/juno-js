import {jsonReplacer, jsonReviver} from './json.utils';
import {nonNullish} from './null.utils';

/**
 * Converts a value to a nullable array.
 * @template T
 * @param {T} [value] - The value to convert.
 * @returns {([] | [T])} A nullable array containing the value if non-nullish, or an empty array if nullish.
 */
export const toNullable = <T>(value?: T): [] | [T] => {
  return nonNullish(value) ? [value] : [];
};

/**
 * Extracts a value from a nullable array.
 * @template T
 * @param {([] | [T])} value - The nullable array.
 * @returns {(T | undefined)} The value if present, or undefined if the array is empty.
 */
export const fromNullable = <T>(value: [] | [T]): T | undefined => {
  return value?.[0];
};

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
