import {nonNullish} from './nullish.utils';

const JSON_KEY_BIGINT = '__bigint__';

/**
 * A custom replacer for `JSON.stringify` that converts specific types not natively supported
 * by the API into JSON-compatible formats.
 *
 * Supported conversions:
 * - `BigInt` → `{ "__bigint__": string }`
 *
 * @param {string} _key - Ignored. Only provided for API compatibility.
 * @param {unknown} value - The value to transform before stringification.
 * @returns {unknown} The transformed value if it matches a known type, otherwise the original value.
 */
// eslint-disable-next-line local-rules/prefer-object-params
export const jsonReplacer = (_key: string, value: unknown): unknown => {
  if (typeof value === 'bigint') {
    return {[JSON_KEY_BIGINT]: `${value}`};
  }

  return value;
};

/**
 * A custom reviver for `JSON.parse` that reconstructs specific types from their JSON-encoded representations.
 *
 * This reverses the transformations applied by `jsonReplacer`, restoring the original types.
 *
 * Supported conversions:
 * - `{ "__bigint__": string }` → `BigInt`
 *
 * @param {string} _key - Ignored but provided for API compatibility.
 * @param {unknown} value - The parsed value to transform.
 * @returns {unknown} The reconstructed value if it matches a known type, otherwise the original value.
 */
// eslint-disable-next-line local-rules/prefer-object-params
export const jsonReviver = (_key: string, value: unknown): unknown => {
  const mapValue = <T>(key: string): T => (value as Record<string, T>)[key];

  if (nonNullish(value) && typeof value === 'object' && JSON_KEY_BIGINT in value) {
    return BigInt(mapValue(JSON_KEY_BIGINT));
  }

  return value;
};
