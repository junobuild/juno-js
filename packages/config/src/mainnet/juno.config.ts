import type {SatelliteConfig} from './satellite.config';

export interface OrbiterConfig {
  /**
   * The identifier of the orbiter used in the dApp.
   */
  id: string;
  /**
   * @deprecated `orbiterId` will be removed in the future. Use `id` instead.
   */
  orbiterId?: string;
}

export interface JunoConfig {
  satellite: SatelliteConfig;
  orbiter?: OrbiterConfig;
}
