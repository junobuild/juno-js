import {assertNonNullish} from './asserts.utils';
import {jsonReplacer, jsonReviver} from './json.utils';
import {nonNullish} from './nullish.utils';

/**
 * Converts a value into a Candid-style variant representation of an optional value.
 *
 * @template T The type of the value.
 * @param {T | null | undefined} value - The value to convert into a Candid-style variant.
 * @returns {[] | [T]} A Candid-style variant representation: an empty array for `null` and `undefined` or an array with the value.
 */
export const toNullable = <T>(value?: T | null): [] | [T] => {
  return nonNullish(value) ? [value] : [];
};

/**
 * Extracts the value from a Candid-style variant representation of an optional value.
 *
 * @template T The type of the value.
 * @param {[] | [T]} value - A Candid-style variant representing an optional value.
 * @returns {T | undefined} The extracted value, or `undefined` if the array is empty.
 */
export const fromNullable = <T>(value: [] | [T]): T | undefined => {
  return value?.[0];
};

/**
 * Extracts the value from a Candid-style variant representation of an optional value,
 * ensuring the value is defined. Throws an error if the array is empty or the value is nullish.
 *
 * @template T The type of the value.
 * @param {[] | [T]} value - A Candid-style variant representing an optional value.
 * @returns {T} The extracted value.
 * @throws {Error} If the array is empty or the value is nullish.
 */
export const fromDefinedNullable = <T>(value: [] | [T]): T => {
  const result = fromNullable(value);

  assertNonNullish(result);

  return result;
};

/**
 * Extracts the value from a nullish Candid-style variant representation.
 *
 * @template T The type of the value.
 * @param {([] | [T]) | undefined} value - A Candid-style variant or `undefined`.
 * @returns {T | undefined} The extracted value, or `undefined` if the input is nullish or the array is empty.
 */
export const fromNullishNullable = <T>(value: ([] | [T]) | undefined): T | undefined =>
  fromNullable(value ?? []);

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
