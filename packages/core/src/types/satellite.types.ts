import type {Identity} from '@dfinity/agent';

/**
 * Represents the configuration for a satellite.
 * @interface
 */
export interface Satellite {
  /**
   * The identity associated with the satellite.
   * @type {Identity}
   */
  identity: Identity;

  /**
   * The unique identifier for the satellite.
   * @type {string}
   */
  satelliteId?: string;

  /**
   * Specifies whether the satellite is running in a container or provides the container URL. i.e. URL to Docker local development.
   * @type {boolean | string}
   */
  container?: boolean | string;
}

/**
 * Represents partial configuration options for a satellite. To be used only on NodeJS or rarely used for browser.
 * @typedef {Partial<Satellite>} SatelliteOptions
 */
export type SatelliteOptions = Partial<Satellite>;
