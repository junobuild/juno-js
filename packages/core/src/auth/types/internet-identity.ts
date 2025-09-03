import type {AuthClientSignInOptions} from './auth-client';

/**
 * Type representing the available Internet Identity domains.
 * @typedef {('internetcomputer.org' | 'ic0.app')} InternetIdentityDomain
 */
export type InternetIdentityDomain = 'internetcomputer.org' | 'ic0.app';

/**
 * Interface representing the specific configuration for Internet Identity.
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
 * Interface representing sign-in options when using the Internet Identity provider.
 * @interface InternetIdentitySignInOptions
 */
export type InternetIdentitySignInOptions = InternetIdentityConfig & AuthClientSignInOptions;