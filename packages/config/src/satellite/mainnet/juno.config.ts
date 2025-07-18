import * as z from 'zod/v4';
import {type EmulatorConfig, EmulatorConfigSchema} from './configs/emulator.config';
import {type OrbiterConfig, OrbiterConfigSchema} from './configs/orbiter.config';
import {type SatelliteConfig, SatelliteConfigOptionsSchema} from './configs/satellite.config';

/**
 * @see JunoConfig
 */
export const JunoConfigSchema = z.strictObject({
  satellite: SatelliteConfigOptionsSchema,
  orbiter: OrbiterConfigSchema.optional(),
  emulator: EmulatorConfigSchema.optional()
});

/**
 * Represents the overall configuration for Juno.
 * @interface JunoConfig
 */
export interface JunoConfig {
  /**
   * The configuration for the satellite.
   * @type {SatelliteConfig}
   */
  satellite: SatelliteConfig;

  /**
   * The optional configuration for the orbiter.
   * @type {OrbiterConfig}
   * @optional
   */
  orbiter?: OrbiterConfig;

  /**
   * Your options for the emulator.
   */
  emulator?: EmulatorConfig;
}
