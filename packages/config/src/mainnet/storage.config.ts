/**
 * Represents a glob pattern for matching files in the storage configuration.
 * @typedef {string} StorageConfigSourceGlob
 */
export type StorageConfigSourceGlob = string;

/**
 * Headers allow the client and the satellite to pass additional information along with a request or a response.
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
}
