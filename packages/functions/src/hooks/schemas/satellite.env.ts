import * as z from 'zod/v4';

/**
 * @see SatelliteEnv
 */
export const SatelliteEnvSchema = z.record(z.string(), z.string());

/**
 * Placeholder for future environment-specific configurations.
 *
 * Currently unused, but it may support features such as:
 * - Defining the execution mode (e.g., staging or production).
 * - Providing environment-specific values like `ckBtcLedgerId` for test or production.
 */
export type SatelliteEnv = z.infer<typeof SatelliteEnvSchema>;
