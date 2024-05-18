import type {Rule} from '../types/rules';

/**
 * Represents a database collection configuration for a satellite in a development environment.
 * @typedef {Omit<Rule, 'createdAt' | 'updatedAt' | 'maxSize'>} SatelliteDevDbCollection
 */
export type SatelliteDevDbCollection = Omit<Rule, 'createdAt' | 'updatedAt' | 'maxSize'>;

/**
 * Represents a storage collection configuration for a satellite in a development environment.
 * @typedef {Omit<Rule, 'createdAt' | 'updatedAt' | 'maxCapacity'>} SatelliteDevStorageCollection
 */
export type SatelliteDevStorageCollection = Omit<Rule, 'createdAt' | 'updatedAt' | 'maxCapacity'>;

/**
 * Represents the collections configuration for a satellite in a development environment.
 * @interface SatelliteDevCollections
 */
export interface SatelliteDevCollections {
  /**
   * The database collections configuration.
   * @type {SatelliteDevDbCollection[]}
   * @optional
   */
  db?: SatelliteDevDbCollection[];

  /**
   * The storage collections configuration.
   * @type {SatelliteDevStorageCollection[]}
   * @optional
   */
  storage?: SatelliteDevStorageCollection[];
}

/**
 * Represents a controller configuration for a satellite in a development environment.
 * @interface SatelliteDevController
 */
export interface SatelliteDevController {
  /**
   * The unique identifier of the controller.
   * @type {string}
   */
  id: string;

  /**
   * The scope of the controller's permissions.
   * @type {'write' | 'admin'}
   */
  scope: 'write' | 'admin';
}

/**
 * Represents the development configuration for a satellite.
 * @interface SatelliteDevConfig
 */
export interface SatelliteDevConfig {
  /**
   * The collections configuration.
   * @type {SatelliteDevCollections}
   */
  collections: SatelliteDevCollections;

  /**
   * The optional controllers configuration.
   * @type {SatelliteDevController[]}
   * @optional
   */
  controllers?: SatelliteDevController[];
}

/**
 * Represents the development configuration for Juno.
 * @interface JunoDevConfig
 */
export interface JunoDevConfig {
  /**
   * The development configuration for the satellite.
   * @type {SatelliteDevConfig}
   */
  satellite: SatelliteDevConfig;
}
