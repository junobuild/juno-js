import type {Identity} from '@dfinity/agent';

/**
 * Configuration options for connecting to a satellite.
 * @interface
 */
export interface SatelliteContext {
  /**
   * The identity used to authenticate with the satellite.
   * Typically derived from Internet Identity or another supported identity type.
   *
   * @type {Identity}
   */
  identity: Identity;

  /**
   * The unique ID of the satellite to interact with.
   * If not provided, attempts to use one defined in environment variables.
   * If ultimately none is available, the call will fail.
   *
   * @type {string}
   * @optional
   */
  satelliteId?: string;

  /**
   * Indicates if the satellite is running in a local container, or provides the container URL.
   * - If `true`, connects to the default local container (for development).
   * - If a string, specifies the full container URL (e.g., "http://localhost:4943").
   * - If not set, connects to the production satellite.
   *
   * @type {boolean | string}
   * @optional
   */
  container?: boolean | string;
}

/**
 * Represents partial configuration options for connecting to a satellite.
 * Typically used in Node.js environments or for advanced configuration scenarios in the browser.
 *
 * @typedef {Partial<SatelliteContext>} SatelliteOptions
 */
export type SatelliteOptions = Partial<SatelliteContext>;
