import type {OrbiterConfig} from './configs/orbiter.config';
import type {SatelliteConfig} from './configs/satellite.config';

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
   * @type {OrbiterId}
   * @optional
   */
  orbiter?: OrbiterConfig;
}
