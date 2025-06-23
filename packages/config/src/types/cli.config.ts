import * as z from 'zod/v4';
import {type EncodingType, EncodingTypeSchema} from './encoding';

/**
 * @see CliConfig
 */
export const CliConfigSchema = z
  .object({
    source: z.string().optional(),
    ignore: z.array(z.string()).optional(),
    gzip: z.union([z.string(), z.literal(false)]).optional(),
    encoding: z.array(z.tuple([z.string(), EncodingTypeSchema])).optional(),
    predeploy: z.array(z.string()).optional(),
    postdeploy: z.array(z.string()).optional()
  })
  .strict();

export interface CliConfig {
  /**
   * Specifies the directory from which to deploy to Storage.
   * For instance, if `npm run build` outputs files to a `dist` folder, use `source: 'dist'`.
   *
   * @default 'build'
   * @type {string}
   */
  source?: string;

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
   * @type {Array<[string, EncodingType]>}
   * @optional
   */
  encoding?: Array<[string, EncodingType]>;

  /**
   * Defines a list of scripts or commands to be run before the deployment process begins.
   * This can be useful for tasks such as compiling assets, running tests, or building production-ready files.
   *
   * Example:
   * ```json
   * {
   *   "predeploy": ["npm run build", "npm run lint"]
   * }
   * ```
   *
   * @type {string[]}
   * @optional
   */
  predeploy?: string[];

  /**
   * Defines a list of scripts or commands to be run after the deployment process completes.
   * This can be used for tasks such as notifications, cleanup, or sending confirmation messages to services or team members.
   *
   * Example:
   * ```json
   * {
   *   "postdeploy": ["./scripts/notify-admins.sh", "echo 'Deployment complete'"]
   * }
   * ```
   *
   * @type {string[]}
   * @optional
   */
  postdeploy?: string[];
}
