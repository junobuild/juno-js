import type {StorageConfig} from '../mainnet/storage.config';
import type {CliConfig} from '../types/cli.config';
import type {JunoConfigMode} from '../types/juno.env';
import type {Either} from '../utils/ts.utils';

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
