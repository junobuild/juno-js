import * as z from 'zod/v4';

/**
 * @see MaxMemorySizeConfig
 */
export const MaxMemorySizeConfigSchema = z.object({
  heap: z.bigint().optional(),
  stable: z.bigint().optional()
}).strict();

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
