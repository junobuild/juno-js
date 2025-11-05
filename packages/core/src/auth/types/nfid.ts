import type {AuthClientSignInOptions} from './auth-client';

/**
 * Interface representing the specific configuration for NFID.
 * @interface NFIDConfig
 * @deprecated Support for sign-in with NFID is deprecated.
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

/**
 * Interface representing sign-in options when using the NFID provider.
 * @interface NFIDSignInOptions
 * @deprecated Support for sign-in with NFID is deprecated.
 */
export type NFIDSignInOptions = NFIDConfig & AuthClientSignInOptions;
