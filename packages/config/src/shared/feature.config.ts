import * as z from 'zod/v4';
import {NumericValueSchema} from '../types/numeric';

/**
 * @see MaxMemorySizeConfig
 */
export const MaxMemorySizeConfigSchema = z
  .object({
    heap: NumericValueSchema.optional(),
    stable: NumericValueSchema.optional()
  })
  .strict();

/**
 * Configuration for granting access to features only if the maximum memory size limits are not reached.
 *
 * The maximum size corresponds to the overall heap or stable memory of the smart contract.
 */
export interface MaxMemorySizeConfig {
  /**
   * Maximum allowed heap memory size in bytes.
   *
   * This field is optional. If not specified, no limit is enforced on the heap memory size.
   *
   * @type {bigint}
   */
  heap?: bigint;

  /**
   * Maximum allowed stable memory size in bytes.
   *
   * This field is optional. If not specified, no limit is enforced on the stable memory size.
   *
   * @type {bigint}
   */
  stable?: bigint;
}
