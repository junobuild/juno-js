import type {SatelliteConfig} from './satellite.config';

export interface OrbiterConfig {
  /**
   * The identifier of the orbiter used in the dApp.
   */
  orbiterId: string;
}

export interface JunoConfig {
  satellite: SatelliteConfig;
  orbiter?: OrbiterConfig;
}
