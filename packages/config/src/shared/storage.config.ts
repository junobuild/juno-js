import type {MaxMemorySizeConfig} from './feature.config';

/**
 * Represents a glob pattern for matching files in the storage configuration.
 * @typedef {string} StorageConfigSourceGlob
 */
export type StorageConfigSourceGlob = string;

/**
 * Headers allow the client and the storage to pass additional information along with a request or a response.
 * Some sets of headers can affect how the browser handles the page and its content.
 * @interface StorageConfigHeader
 */
export interface StorageConfigHeader {
  /**
   * The glob pattern used to match files within the storage that these headers will apply to.
   * @type {StorageConfigSourceGlob}
   */
  source: StorageConfigSourceGlob;

  /**
   * An array of key-value pairs representing the headers to apply.
   * Each pair includes the header name and its value.
   * Example: `[["Cache-Control", "max-age=3600"], ["X-Custom-Header", "value"]]`
   * @type {Array<[string, string]>}
   */
  headers: [string, string][];
}

/**
 * You can utilize optional rewrites to display the same content for multiple URLs.
 * Rewrites are especially useful when combined with pattern matching, allowing acceptance of any URL that matches the pattern.
 * @interface StorageConfigRewrite
 */
export interface StorageConfigRewrite {
  /**
   * The glob pattern or specific path to match for incoming requests.
   * Matches are rewritten to the specified destination.
   * @type {StorageConfigSourceGlob}
   */
  source: StorageConfigSourceGlob;

  /**
   * The destination path or file to which matching requests should be rewritten.
   * @type {string}
   */
  destination: string;
}

/**
 * Use a URL redirect to prevent broken links if you've moved a page or to shorten URLs.
 * @interface StorageConfigRedirect
 */
export interface StorageConfigRedirect {
  /**
   * The glob pattern or specific path to match for incoming requests that should be redirected.
   * @type {StorageConfigSourceGlob}
   */
  source: StorageConfigSourceGlob;

  /**
   * The URL or path to which the request should be redirected.
   * @type {string}
   */
  location: string;

  /**
   * The HTTP status code to use for the redirect, typically 301 (permanent redirect) or 302 (temporary redirect).
   * @type {301 | 302}
   */
  code: 301 | 302;
}

/**
 * Configures the hosting behavior of the storage.
 * @interface StorageConfig
 */
export interface StorageConfig {
  /**
   * Optional array of `StorageConfigHeader` objects to define custom HTTP headers for specific files or patterns.
   * @type {StorageConfigHeader[]}
   * @optional
   */
  headers?: StorageConfigHeader[];

  /**
   * Optional array of `StorageConfigRewrite` objects to define rewrite rules.
   * @type {StorageConfigRewrite[]}
   * @optional
   */
  rewrites?: StorageConfigRewrite[];

  /**
   * Optional array of `StorageConfigRedirect` objects to define HTTP redirects.
   * @type {StorageConfigRedirect[]}
   * @optional
   */
  redirects?: StorageConfigRedirect[];

  /**
   * For security reasons and to prevent click-jacking attacks, dapps deployed with Juno are, by default, set to deny embedding in other sites.
   *
   * Options are:
   * - `deny`: Prevents any content from being displayed in an iframe.
   * - `same-origin`: Allows iframe content from the same origin as the page.
   * - `allow-any`: Allows iframe content from any origin.
   *
   * If not specified, then `deny` is used as default value.
   * @type {'deny' | 'same-origin' | 'allow-any'}
   * @optional
   */
  iframe?: 'deny' | 'same-origin' | 'allow-any';

  /**
   * Optional flag to enable access for raw URLs.
   *
   * ⚠️ **WARNING: Enabling this option is highly discouraged due to security risks.**
   *
   * Enabling this option allows access to raw URLs (e.g., https://satellite-id.raw.icp0.io), bypassing certificate validation.
   * This creates a security vulnerability where a malicious node in the chain can respond to requests with malicious or invalid content.
   * Since there is no validation on raw URLs, the client may receive and process harmful data.
   *
   * If not specified, the default value is `false`.
   * @type {boolean}
   * @optional
   */
  rawAccess?: boolean;

  /**
   * Configuration for maximum memory size limits for the Storage.
   *
   * This is used to specify optional limits on heap and stable memory for the smart contract.
   * When the limit is reached, the Storage and smart contract continue to operate normally but reject the upload of new assets.
   *
   * If not specified, no memory limits are enforced.
   *
   * @type {MaxMemorySizeConfig}
   * @optional
   */
  maxMemorySize?: MaxMemorySizeConfig;
}
