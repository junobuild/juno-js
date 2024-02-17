import type {ENCODING_TYPE} from './encoding';
import type {JunoConfigMode} from './juno.env';
import type {StorageConfig} from './storage.config';
import type {Either} from './utility';

export interface SatelliteAssertions {
  /**
   * Configuration for the heap memory size check, which can be:
   * - `true` to enable the check with a default threshold of 900MB,
   * - `false` to disable the heap memory size check,
   * - A `number` to specify a custom threshold in MB (megabytes) for the heap memory size check.
   *
   * If not specified, then `true` is used as default value.
   */
  heapMemory?: number | boolean;
}

export interface SatelliteId {
  /**
   * The unique identifier (ID) of the satellite for this application.
   */
  satelliteId: string;
}

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
   */
  satellitesIds: Record<JunoConfigMode, string>;
}

export type SatelliteConfig = Either<SatelliteId, SatelliteIds> & {
  /**
   * Specifies the directory from which to deploy to storage.
   * For instance, if `npm run build` outputs files to a `dist` folder, use `source: 'dist'`.
   *
   * @default `build`
   */
  source?: string;

  /**
   * Optional configuration parameters for the satellite, affecting the operational behavior of its Storage.
   * Changes to these parameters must be applied manually afterwards using `juno config` commands.
   */
  storage?: StorageConfig;

  /**
   * Specifies files or patterns to ignore during deployment, using glob patterns similar to those in .gitignore.
   */
  ignore?: string[];

  /**
   * Controls the Gzip compression optimization for files in the source folder. By default, it targets JavaScript (js), ES Module (mjs), and CSS (css) files.
   * You can disable this by setting it to `false` or customize it with a different file matching pattern using glob syntax.
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
   */
  encoding?: Array<[string, ENCODING_TYPE]>;

  /**
   * Optional configurations to override default assertions made by the CLI regarding satellite deployment conditions.
   */
  assertions?: SatelliteAssertions;
};
