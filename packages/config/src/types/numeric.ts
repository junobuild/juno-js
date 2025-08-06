import * as z from 'zod/v4';

/**
 * @see NumericValueS
 */
export const NumericValueSchema = z.union([z.bigint(), z.number()]);

/**
 * Represents a value that can be either a bigint or a number.
 * This is necessary because JSON does not support bigint, so configuration files may use number instead.
 *
 * @typedef {bigint | number} NumericValue
 */
export type NumericValue = bigint | number;