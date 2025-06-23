import * as z from 'zod/v4';
import {type StorageConfig, StorageConfigSchema} from '../shared/storage.config';
import {type CliConfig, CliConfigSchema} from '../types/cli.config';
import {type JunoConfigMode, JunoConfigModeSchema} from '../types/juno.env';
import type {Either} from '../types/utility.types';

/**
 * @see ConsoleId
 */
export const ConsoleIdSchema = z.object({
  id: z.string()
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
  id: string;
}

export const ConsoleIdsSchema = z.object({
  ids: z.record(JunoConfigModeSchema, z.string())
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
  ids: Record<JunoConfigMode, string>;
}

/**
 * @see JunoConsoleConfig
 */
export const JunoConsoleConfigSchema = z
  .union([ConsoleIdSchema, ConsoleIdsSchema])
  .and(CliConfigSchema)
  .and(
    z.object({
      storage: StorageConfigSchema.optional()
    })
  );

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
