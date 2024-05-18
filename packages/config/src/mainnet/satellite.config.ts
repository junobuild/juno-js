import type {ENCODING_TYPE} from '../types/encoding';
import type {Either} from '../utils/ts.utils';
import type {AuthenticationConfig} from './authentication.config';
import type {JunoConfigMode} from './juno.env';
import type {StorageConfig} from './storage.config';

/**
 * Configuration for satellite assertions.
 * @interface SatelliteAssertions
 */
export interface SatelliteAssertions {
  /**
   * Configuration for the heap memory size check, which can be:
   * - `true` to enable the check with a default threshold of 900MB,
   * - `false` to disable the heap memory size check,
   * - A `number` to specify a custom threshold in MB (megabytes) for the heap memory size check.
   *
   * If not specified, then `true` is used as the default value.
   * @type {number | boolean}
   */
  heapMemory?: number | boolean;
}

/**
 * Represents the unique identifier for a satellite.
 * @interface SatelliteId
 */
export interface SatelliteId {
  /**
   * The unique identifier (ID) of the satellite for this application.
   * @type {string}
   */
  id: string;

  /**
   * The deprecated unique identifier (ID) of the satellite.
   * @deprecated `satelliteId` will be removed in the future. Use `id` instead.
   * @type {string}
   */
  satelliteId?: string;
}

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
  ids: Record<JunoConfigMode, string>;
}

/**
 * Represents the configuration for a satellite.
 * @typedef {Either<SatelliteId, SatelliteIds>} SatelliteConfig
 */
export type SatelliteConfig = Either<SatelliteId, SatelliteIds> & {
  /**
   * Specifies the directory from which to deploy to storage.
   * For instance, if `npm run build` outputs files to a `dist` folder, use `source: 'dist'`.
   *
   * @default 'build'
   * @type {string}
   */
  source?: string;

  /**
   * Optional configuration parameters for the satellite, affecting the operational behavior of its Storage.
   * Changes to these parameters must be applied manually afterwards, for example with the CLI using `juno config` commands.
   * @type {StorageConfig}
   * @optional
   */
  storage?: StorageConfig;

  /**
   * Optional configuration parameters for the satellite, affecting the operational behavior of its Authentication.
   * Changes to these parameters must be applied manually afterwards, for example with the CLI using `juno config` commands.
   * @type {AuthenticationConfig}
   * @optional
   */
  authentication?: AuthenticationConfig;

  /**
   * Specifies files or patterns to ignore during deployment, using glob patterns similar to those in .gitignore.
   * @type {string[]}
   * @optional
   */
  ignore?: string[];

  /**
   * Controls the Gzip compression optimization for files in the source folder. By default, it targets JavaScript (js), ES Module (mjs), and CSS (css) files.
   * You can disable this by setting it to `false` or customize it with a different file matching pattern using glob syntax.
   * @type {string | false}
   * @optional
   */
  gzip?: string | false;

  /**
   * Customizes file encoding mapping for HTTP response headers `Content-Encoding` based on file extension:
   * - `.Z` for compress,
   * - `.gz` for gzip,
   * - `.br` for brotli,
   * - `.zlib` for deflate,
   * - anything else defaults to `identity`.
   * The "encoding" attribute allows overriding default mappings with an array of glob patterns and encoding types.
   * @type {Array<[string, ENCODING_TYPE]>}
   * @optional
   */
  encoding?: Array<[string, ENCODING_TYPE]>;

  /**
   * Optional configurations to override default assertions made by the CLI regarding satellite deployment conditions.
   * @type {SatelliteAssertions}
   * @optional
   */
  assertions?: SatelliteAssertions;
};
