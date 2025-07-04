import * as z from 'zod/v4';

/**
 * @see SatelliteAssertions
 */
export const SatelliteAssertionsSchema = z.strictObject({
  heapMemory: z.union([z.number(), z.boolean()]).optional()
});

/**
 * Configuration for satellite assertions.
 * @interface SatelliteAssertions
 */
export interface SatelliteAssertions {
  /**
   * Configuration for the heap memory size check, which can be:
   * - `true` to enable the check with a default threshold of 900MB,
   * - `false` to disable the heap memory size check,
   * - A `number` to specify a custom threshold in MB (megabytes) for the heap memory size check.
   *
   * If not specified, then `true` is used as the default value.
   * @type {number | boolean}
   */
  heapMemory?: number | boolean;
}
