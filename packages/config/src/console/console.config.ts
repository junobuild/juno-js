import {type PrincipalText, PrincipalTextSchema} from '@dfinity/zod-schemas';
import * as z from 'zod/v4';
import {type StorageConfig, StorageConfigSchema} from '../shared/storage.config';
import {type CliConfig, CliConfigSchema} from '../types/cli.config';
import {type JunoConfigMode, JunoConfigModeSchema} from '../types/juno.env';
import type {Either} from '../types/utility.types';

/**
 * @see ConsoleId
 */
export const ConsoleIdSchema = z.object({
  id: PrincipalTextSchema
});

/**
 * Represents the unique identifier for a console.
 * @interface ConsoleId
 */
export interface ConsoleId {
  /**
   * The unique identifier (ID) of the console.
   * @type {string}
   */
  id: PrincipalText;
}

/**
 * @see ConsoleIds
 */
export const ConsoleIdsSchema = z.object({
  ids: z.record(JunoConfigModeSchema, PrincipalTextSchema)
});

/**
 * Represents a mapping of console identifiers to different configurations based on the mode of the application.
 * @interface ConsoleIds
 */
export interface ConsoleIds {
  /**
   * A mapping of console identifiers (IDs) to different configurations based on the mode of the application.
   *
   * This allows the application to use different console IDs, such as production, staging, etc.
   * @type {Record<JunoConfigMode, string>}
   */
  ids: Record<JunoConfigMode, PrincipalText>;
}

const JunoConsoleConfigBaseSchema = z.object({
  ...CliConfigSchema.shape,
  storage: StorageConfigSchema.optional()
});

/**
 * @see JunoConsoleConfig
 */
export const JunoConsoleConfigSchema = z.union([
  z
    .object({
      ...ConsoleIdSchema.shape,
      ...JunoConsoleConfigBaseSchema.shape
    })
    .strict(),
  z
    .object({
      ...ConsoleIdsSchema.shape,
      ...JunoConsoleConfigBaseSchema.shape
    })
    .strict()
]);

/**
 * Represents the configuration for a console.
 * @typedef {Either<ConsoleId, ConsoleIds>} ConsoleConfig
 */
export type JunoConsoleConfig = Either<ConsoleId, ConsoleIds> &
  CliConfig & {
    /**
     * Optional configuration parameters for the console, affecting the operational behavior of its Storage.
     * @type {StorageConfig}
     * @optional
     */
    storage?: StorageConfig;
  };
