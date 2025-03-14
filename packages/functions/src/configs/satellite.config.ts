import * as z from 'zod';

/**
 * Placeholder for future environment-specific configurations.
 *
 * Currently unused, but it may support features such as:
 * - Defining the execution mode (e.g., staging or production).
 * - Providing environment-specific values like `ckBtcLedgerId` for test or production.
 */
export const SatelliteConfigEnvSchema = z.record(z.unknown());

/** @typedef {z.infer<typeof SatelliteConfigEnvSchema>} SatelliteConfigEnv */
export type SatelliteConfigEnv = z.infer<typeof SatelliteConfigEnvSchema>;
