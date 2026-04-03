const NANOSECONDS_PER_MILLISECOND = 1_000_000n;

/**
 * Returns the current timestamp in nanoseconds as a `bigint`.
 *
 * @returns {bigint} The current timestamp in nanoseconds.
 */
export const nowInBigIntNanoSeconds = (): bigint =>
  BigInt(Date.now()) * NANOSECONDS_PER_MILLISECOND;

/**
 * Converts a given `Date` object to a timestamp in nanoseconds as a `bigint`.
 *
 * @param {Date} date - The `Date` object to convert.
 * @returns {bigint} The timestamp in nanoseconds.
 */
export const toBigIntNanoSeconds = (date: Date): bigint =>
  BigInt(date.getTime()) * NANOSECONDS_PER_MILLISECOND;
