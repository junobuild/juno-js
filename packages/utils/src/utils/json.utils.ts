import {Principal} from '@dfinity/principal';
import {nonNullish} from './null.utils';

const JSON_KEY_BIGINT = '__bigint__';
const JSON_KEY_PRINCIPAL = '__principal__';
const JSON_KEY_UINT8ARRAY = '__uint8array__';

/**
 * A function that alters the behavior of the stringification process for BigInt, Principal, and Uint8Array.
 * @param {string} _key - The key of the value being stringified.
 * @param {unknown} value - The value being stringified.
 * @returns {unknown} The altered value for stringification.
 */
// eslint-disable-next-line local-rules/prefer-object-params
export const jsonReplacer = (_key: string, value: unknown): unknown => {
  if (typeof value === 'bigint') {
    return {[JSON_KEY_BIGINT]: `${value}`};
  }

  if (nonNullish(value) && value instanceof Principal) {
    return {[JSON_KEY_PRINCIPAL]: value.toText()};
  }

  if (nonNullish(value) && value instanceof Uint8Array) {
    return {[JSON_KEY_UINT8ARRAY]: Array.from(value)};
  }

  return value;
};

/**
 * A parser that interprets revived BigInt, Principal, and Uint8Array when constructing JavaScript values or objects.
 * @param {string} _key - The key of the value being parsed.
 * @param {unknown} value - The value being parsed.
 * @returns {unknown} The parsed value.
 */
// eslint-disable-next-line local-rules/prefer-object-params
export const jsonReviver = (_key: string, value: unknown): unknown => {
  const mapValue = <T>(key: string): T => (value as Record<string, T>)[key];

  if (nonNullish(value) && typeof value === 'object' && JSON_KEY_BIGINT in value) {
    return BigInt(mapValue(JSON_KEY_BIGINT));
  }

  if (nonNullish(value) && typeof value === 'object' && JSON_KEY_PRINCIPAL in value) {
    return Principal.fromText(mapValue(JSON_KEY_PRINCIPAL));
  }

  if (nonNullish(value) && typeof value === 'object' && JSON_KEY_UINT8ARRAY in value) {
    return Uint8Array.from(mapValue(JSON_KEY_UINT8ARRAY));
  }

  return value;
};
