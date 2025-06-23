import {type PrincipalText, PrincipalTextSchema} from '@dfinity/zod-schemas';
import * as z from 'zod/v4';
import {type Rule, RuleSchema} from '../types/rules';

/**
 * @see SatelliteDevDataStoreCollection
 */
export const SatelliteDevDataStoreCollectionSchema = RuleSchema.omit({
  createdAt: true,
  updatedAt: true,
  maxSize: true,
  version: true
});

/**
 * Represents a database collection configuration for a satellite in a development environment.
 * @typedef {Omit<Rule, 'createdAt' | 'updatedAt' | 'maxSize' | 'version'>} SatelliteDevDataStoreCollection
 */
export type SatelliteDevDataStoreCollection = Omit<
  Rule,
  'createdAt' | 'updatedAt' | 'maxSize' | 'version'
>;

/**
 * @see SatelliteDevStorageCollection
 */
export const SatelliteDevStorageCollectionSchema = RuleSchema.omit({
  createdAt: true,
  updatedAt: true,
  maxCapacity: true,
  version: true
});

/**
 * Represents a Storage collection configuration for a satellite in a development environment.
 * @typedef {Omit<Rule, 'createdAt' | 'updatedAt' | 'maxCapacity' | 'version'>} SatelliteDevStorageCollection
 */
export type SatelliteDevStorageCollection = Omit<
  Rule,
  'createdAt' | 'updatedAt' | 'maxCapacity' | 'version'
>;

/**
 * @see SatelliteDevCollections
 */
export const SatelliteDevCollectionsSchema = z.strictObject({
  datastore: z.array(SatelliteDevDataStoreCollectionSchema).optional(),
  storage: z.array(SatelliteDevStorageCollectionSchema).optional()
});

/**
 * Represents the collections configuration for a satellite in a development environment.
 * @interface SatelliteDevCollections
 */
export interface SatelliteDevCollections {
  /**
   * The Datastore collections configuration.
   * @type {SatelliteDevDataStoreCollection[]}
   * @optional
   */
  datastore?: SatelliteDevDataStoreCollection[];

  /**
   * The Storage collections configuration.
   * @type {SatelliteDevStorageCollection[]}
   * @optional
   */
  storage?: SatelliteDevStorageCollection[];
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
