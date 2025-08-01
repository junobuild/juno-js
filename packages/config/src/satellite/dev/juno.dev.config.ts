import {type PrincipalText, PrincipalTextSchema} from '@dfinity/zod-schemas';
import * as z from 'zod/v4';
import {type Collections, CollectionsSchema} from '../configs/collections';

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
  collections: CollectionsSchema,
  controllers: z.array(SatelliteDevControllerSchema).optional()
});

/**
 * Represents the development configuration for a satellite.
 * @interface SatelliteDevConfig
 */
export interface SatelliteDevConfig {
  /**
   * The collections configuration.
   * @type {Collections}
   */
  collections: Collections;

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
