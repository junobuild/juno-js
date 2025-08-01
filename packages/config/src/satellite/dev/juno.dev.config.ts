import {type PrincipalText, PrincipalTextSchema} from '@dfinity/zod-schemas';
import * as z from 'zod/v4';
import {
  type DatastoreCollection,
  type StorageCollection,
  DatastoreCollectionSchema,
  StorageCollectionSchema
} from '../configs/collections';

/**
 * @see SatelliteDevCollections
 */
export const SatelliteDevCollectionsSchema = z.strictObject({
  datastore: z.array(DatastoreCollectionSchema).optional(),
  storage: z.array(StorageCollectionSchema).optional()
});

/**
 * Represents the collections configuration for a satellite in a development environment.
 * @interface SatelliteDevCollections
 */
export interface SatelliteDevCollections {
  /**
   * The Datastore collections configuration.
   * @type {DatastoreCollection[]}
   * @optional
   */
  datastore?: DatastoreCollection[];

  /**
   * The Storage collections configuration.
   * @type {StorageCollection[]}
   * @optional
   */
  storage?: StorageCollection[];
}

/**
 * @see SatelliteDevController
 */
export const SatelliteDevControllerSchema = z.strictObject({
  id: PrincipalTextSchema,
  scope: z.enum(['write', 'admin', 'submit'])
});

/**
 * Represents a controller configuration for a satellite in a development environment.
 * @interface SatelliteDevController
 */
export interface SatelliteDevController {
  /**
   * The unique identifier of the controller.
   * @type {string}
   */
  id: PrincipalText;

  /**
   * The scope of the controller's permissions.
   * @type {'write' | 'admin'}
   */
  scope: 'write' | 'admin' | 'submit';
}

/**
 * @see SatelliteDevConfig
 */
export const SatelliteDevConfigSchema = z.strictObject({
  collections: SatelliteDevCollectionsSchema,
  controllers: z.array(SatelliteDevControllerSchema).optional()
});

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
 * @see JunoDevConfig
 */
export const JunoDevConfigSchema = z.strictObject({
  satellite: SatelliteDevConfigSchema
});

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
