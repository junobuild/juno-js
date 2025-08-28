/**
 * Interface representing sign-in options when using an AuthClient based provider.
 * @interface AuthClientSignInOptions
 */
export interface AuthClientSignInOptions {
  /**
   * Maximum time to live for the session. Cannot be extended.
   * @type {bigint}
   */
  maxTimeToLive?: bigint;

  /**
   * Origin for derivation. Useful when sign-in using the same domain - e.g. sign-in on www.hello.com for hello.com.
   * @type {(string | URL)}
   */
  derivationOrigin?: string | URL;

  /**
   * Whether to open the sign-in window.
   * @default true
   * @type {boolean}
   */
  windowed?: boolean;

  /**
   * Whether to allow the infamous PIN authentication.
   * @default false
   * @type {boolean}
   */
  allowPin?: boolean;
}

/**
 * Type representing the available Internet Identity domains.
 * @typedef {('internetcomputer.org' | 'ic0.app')} InternetIdentityDomain
 */
export type InternetIdentityDomain = 'internetcomputer.org' | 'ic0.app';

/**
 * Interface representing the configuration for Internet Identity.
 * @interface InternetIdentityConfig
 */
export interface InternetIdentityConfig {
  /**
   * The domain for Internet Identity.
   * @default internetcomputer.org
   * @type {InternetIdentityDomain}
   */
  domain?: InternetIdentityDomain;
}

/**
 * Interface representing the configuration for NFID.
 * @interface NFIDConfig
 */
export interface NFIDConfig {
  /**
   * The name of the application.
   * @type {string}
   */
  appName: string;

  /**
   * The URL of the application's logo.
   * @type {string}
   */
  logoUrl: string;
}
