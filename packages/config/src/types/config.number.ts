import * as z from 'zod/v4';

export const BaseConfigNumberSchema = z.union([z.bigint(), z.number()]);

/**
 * @see ConfigNumber
 */
export const ConfigNumberSchema = BaseConfigNumberSchema.transform((value) =>
  typeof value === 'number' ? BigInt(value) : value
);

/**
 * Represents a value that can be either a bigint or a number.
 * This is necessary because JSON does not support bigint, so configuration files may use number instead.
 *
 * @typedef {bigint | number} ConfigNumber
 */
export type ConfigNumber = bigint | number;
