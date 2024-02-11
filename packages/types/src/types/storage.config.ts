/**
 * Represents a glob pattern for matching files in the storage configuration.
 */
export type StorageConfigSourceGlob = string;

/**
 * Headers allow the client and the satellite to pass additional information along with a request or a response. Some sets of headers can affect how the browser handles the page and its content.
 */
export interface StorageConfigHeader {
  /**
   * The glob pattern used to match files within the storage that these headers will apply to.
   */
  source: StorageConfigSourceGlob;

  /**
   * An array of key-value pairs representing the headers to apply. Each pair includes the header name and its value.
   * Example: `[["Cache-Control", "max-age=3600"], ["X-Custom-Header", "value"]]`
   */
  headers: [string, string][];
}

/**
 * You can utilize optional rewrites to display the same content for multiple URLs. Rewrites are especially useful when combined with pattern matching, allowing acceptance of any URL that matches the pattern.
 */
export interface StorageConfigRewrite {
  /**
   * The glob pattern or specific path to match for incoming requests. Matches are rewritten to the specified destination.
   */
  source: StorageConfigSourceGlob;

  /**
   * The destination path or file to which matching requests should be rewritten.
   */
  destination: string;
}

/**
 * Use a URL redirect to prevent broken links if you've moved a page or to shorten URLs.
 */
export interface StorageConfigRedirect {
  /**
   * The glob pattern or specific path to match for incoming requests that should be redirected.
   */
  source: StorageConfigSourceGlob;

  /**
   * The URL or path to which the request should be redirected.
   */
  location: string;

  /**
   * The HTTP status code to use for the redirect, typically 301 (permanent redirect) or 302 (temporary redirect).
   */
  code: 301 | 302;
}

/**
 * Configures the Hosting behavior of the Storage.
 */
export interface StorageConfig {
  /**
   * Optional array of `StorageConfigHeader` objects to define custom HTTP headers for specific files or patterns.
   */
  headers?: StorageConfigHeader[];

  /**
   * Optional array of `StorageConfigRewrite` objects to define rewrite rules.
   */
  rewrites?: StorageConfigRewrite[];

  /**
   * Optional array of `StorageConfigRedirect` objects to define HTTP redirects.
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
   */
  iframe?: 'deny' | 'same-origin' | 'allow-any';
}
