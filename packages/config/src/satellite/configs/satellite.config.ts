import {type PrincipalText, PrincipalTextSchema} from '@dfinity/zod-schemas';
import * as z from 'zod';
import {type StorageConfig, StorageConfigSchema} from '../../shared/storage.config';
import type {CliConfig} from '../../types/cli.config';
import {type JunoConfigMode, JunoConfigModeSchema} from '../../types/juno.env';
import type {Either} from '../../types/utility.types';
import {StrictPrincipalTextSchema} from '../../utils/principal.utils';
import {type SatelliteAssertions, SatelliteAssertionsSchema} from './assertions.config';
import {type AuthenticationConfig, AuthenticationConfigSchema} from './authentication.config';
import {type Collections, CollectionsSchema} from './collections';
import {type DatastoreConfig, DatastoreConfigSchema} from './datastore.config';
import {type ModuleSettings, ModuleSettingsSchema} from './module.settings';

/**
 * @see SatelliteId
 */
export const SatelliteIdSchema = z.object({
  id: PrincipalTextSchema
});

/**
 * Represents the unique identifier for a satellite.
 * @interface SatelliteId
 */
export interface SatelliteId {
  /**
   * The unique identifier (ID) of the satellite for this application.
   * @type {string}
   */
  id: PrincipalText;
}

/**
 * @see SatelliteIds
 */
export const SatelliteIdsSchema = z.object({
  ids: z.record(JunoConfigModeSchema, StrictPrincipalTextSchema)
});

/**
 * Represents a mapping of satellite identifiers to different configurations based on the mode of the application.
 * @interface SatelliteIds
 */
export interface SatelliteIds {
  /**
   * A mapping of satellite identifiers (IDs) to different configurations based on the mode of the application.
   *
   * This allows the application to use different satellite IDs, such as production, staging, etc.
   *
   * Example:
   * {
   *   "production": "xo2hm-lqaaa-aaaal-ab3oa-cai",
   *   "staging": "gl6nx-5maaa-aaaaa-qaaqq-cai"
   * }
   * @type {Record<JunoConfigMode, string>}
   */
  ids: Record<JunoConfigMode, PrincipalText>;
}

/**
 * @see SatelliteConfigOptions
 */
const SatelliteConfigOptionsBaseSchema = z.object({
  storage: StorageConfigSchema.optional(),
  datastore: DatastoreConfigSchema.optional(),
  authentication: AuthenticationConfigSchema.optional(),
  assertions: SatelliteAssertionsSchema.optional(),
  settings: ModuleSettingsSchema.optional(),
  collections: CollectionsSchema.optional()
});

/**
 * @see JunoConsoleConfig
 */
export const SatelliteConfigOptionsSchema = z.union([
  z
    .object({
      ...SatelliteIdSchema.shape,
      ...SatelliteConfigOptionsBaseSchema.shape
    })
    .strict(),
  z
    .object({
      ...SatelliteIdsSchema.shape,
      ...SatelliteConfigOptionsBaseSchema.shape
    })
    .strict()
]);

/**
 * SatelliteConfigOptions interface provides configuration settings that allow for fine-tuning
 * the operational behavior of various aspects of a Satellite, such as storage, datastore,
 * authentication, and deployment assertions.
 *
 * These options affect specific modules of the Satellite and may require manual application of
 * changes, typically through CLI commands (e.g., `juno config`).
 *
 * @interface SatelliteConfigOptions
 *
 * @property {StorageConfig} [storage] - Configuration settings for storage management in the Satellite.
 * @property {DatastoreConfig} [datastore] - Configuration settings for datastore management.
 * @property {AuthenticationConfig} [authentication] - Authentication-specific configurations.
 * @property {SatelliteAssertions} [assertions] - Conditions and assertions for deployment or operational checks.
 * @property {ModuleSettings} [settings] - General settings governing module behavior and resource management.
 */
export interface SatelliteConfigOptions {
  /**
   * Optional configuration parameters for the satellite, affecting the operational behavior of its Storage.
   * Changes to these parameters must be applied manually afterwards, for example with the CLI using `juno config` commands.
   * @type {StorageConfig}
   * @optional
   */
  storage?: StorageConfig;

  /**
   * Optional configuration parameters for the satellite, affecting the operational behavior of its Datastore.
   * Changes to these parameters must be applied manually afterwards, for example with the CLI using `juno config` commands.
   * @type {DatastoreConfig}
   * @optional
   */
  datastore?: DatastoreConfig;

  /**
   * Optional configuration parameters for the satellite, affecting the operational behavior of its Authentication.
   * Changes to these parameters must be applied manually afterwards, for example with the CLI using `juno config` commands.
   * @type {AuthenticationConfig}
   * @optional
   */
  authentication?: AuthenticationConfig;

  /**
   * Optional configurations to override default assertions made by the CLI regarding satellite deployment conditions.
   * @type {SatelliteAssertions}
   * @optional
   */
  assertions?: SatelliteAssertions;

  /**
   * Optional configuration parameters for the Satellite.
   * These settings control various aspects of the module's behavior and resource usage.
   * @type {ModuleSettings}
   * @optional
   */
  settings?: ModuleSettings;

  /**
   * Optional configuration for the Datastore and Storage collections.
   * @type {Collections}
   * @optional
   */
  collections?: Collections;
}

/**
 * Represents the configuration for a satellite.
 *
 * @typedef {Either<SatelliteId, SatelliteIds> & CliConfig & SatelliteConfigOptions} SatelliteConfig
 * @property {SatelliteId | SatelliteIds} SatelliteId or SatelliteIds - Defines a unique Satellite or a collection of Satellites.
 * @property {CliConfig} CliConfig - Configuration specific to the CLI interface.
 * @property {SatelliteConfigOptions} SatelliteConfigOptions - Additional configuration options for the Satellite.
 */
export type SatelliteConfig = Either<SatelliteId, SatelliteIds> &
  CliConfig &
  SatelliteConfigOptions;
