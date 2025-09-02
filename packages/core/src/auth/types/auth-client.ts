import type {SignProgressFn} from './progress';

/**
 * Enum representing the different steps of the sign-in flow with Internet Identity or NFID.
 */
export enum AuthClientSignInProgressStep {
  /** User is authenticating with the identity provider (II / NFID). */
  AuthorizingWithProvider,
  /** App is creating a new user or retrieving an existing one after authorization. */
  CreatingOrRetrievingUser
}

/**
 * Interface representing sign-in options when using an AuthClient based provider.
 * @interface AuthClientSignInOptions
 */
export interface AuthClientSignInOptions {
  /**
   * Maximum time to live for the session in nanoseconds. Cannot be extended.
   * @type {bigint}
   */
  maxTimeToLiveInNanoseconds?: bigint;

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

  /**
   * Optional callback to receive progress updates about the sign-in flow.
   * Useful for showing UI feedback such as loading indicators or status messages.
   */
  onProgress?: SignProgressFn<AuthClientSignInProgressStep>;
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
