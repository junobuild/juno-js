import type {Rule} from '../types/rules';

/**
 * Represents a database collection configuration for a satellite in a development environment.
 * @typedef {Omit<Rule, 'createdAt' | 'updatedAt' | 'maxSize' | 'version'>} SatelliteDevDataStoreCollection
 */
export type SatelliteDevDataStoreCollection = Omit<
  Rule,
  'createdAt' | 'updatedAt' | 'maxSize' | 'version'
>;

/**
 * This type is an alias for SatelliteDevDataStoreCollection and is now deprecated.
 *
 * @see SatelliteDevDataStoreCollection
 * @deprecated Use {@link SatelliteDevDataStoreCollection} instead.
 * @typedef {SatelliteDevDataStoreCollection} SatelliteDevDbCollection
 */
export type SatelliteDevDbCollection = SatelliteDevDataStoreCollection;

/**
 * Represents a storage collection configuration for a satellite in a development environment.
 * @typedef {Omit<Rule, 'createdAt' | 'updatedAt' | 'maxCapacity' | 'version'>} SatelliteDevStorageCollection
 */
export type SatelliteDevStorageCollection = Omit<
  Rule,
  'createdAt' | 'updatedAt' | 'maxCapacity' | 'version'
>;

/**
 * Represents the collections configuration for a satellite in a development environment.
 * @interface SatelliteDevCollections
 */
export interface SatelliteDevCollections {
  /**
   * The datastore collections configuration.
   * @type {SatelliteDevDataStoreCollection[]}
   * @optional
   */
  datastore?: SatelliteDevDataStoreCollection[];

  /**
   * The datastore collections configuration.
   * This property is deprecated. Use {@link datastore} instead.
   *
   * @deprecated
   * @type {SatelliteDevDbCollection[]}
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
