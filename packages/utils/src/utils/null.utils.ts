/**
 * Checks if the provided argument is null or undefined.
 * @template T
 * @param {T | undefined | null} argument - The argument to check.
 * @returns {boolean} True if the argument is null or undefined, false otherwise.
 */
export const isNullish = <T>(argument: T | undefined | null): argument is undefined | null =>
    argument === null || argument === undefined;

/**
 * Checks if the provided argument is neither null nor undefined.
 * @template T
 * @param {T | undefined | null} argument - The argument to check.
 * @returns {boolean} True if the argument is neither null nor undefined, false otherwise.
 */
export const nonNullish = <T>(argument: T | undefined | null): argument is NonNullable<T> =>
    !isNullish(argument);

/**
 * Represents an error thrown when a value is null or undefined.
 * @class
 * @extends {Error}
 */
export class NullishError extends Error {}

/**
 * Asserts that a value is neither null nor undefined.
 * @template T
 * @param {T} value - The value to check.
 * @param {string} [message] - The optional error message to use if the assertion fails.
 * @throws {NullishError} If the value is null or undefined.
 * @returns {asserts value is NonNullable<T>} Asserts that the value is neither null nor undefined.
 */
export const assertNonNullish: <T>(
    value: T,
    message?: string
) => asserts value is NonNullable<T> = <T>(value: T, message?: string): void => {
  if (isNullish(value)) {
    throw new NullishError(message);
  }
};
