import * as z from 'zod/v4';

/**
 * @see AuthenticationConfigInternetIdentity
 */
export const AuthenticationConfigInternetIdentitySchema = z.strictObject({
  derivationOrigin: z.url().optional(),
  externalAlternativeOrigins: z.array(z.url()).optional()
});

/**
 * Configure the behavior of Internet Identity.
 * @interface AuthenticationConfigInternetIdentity
 */
export interface AuthenticationConfigInternetIdentity {
  /**
   * This setting ensures that users are recognized on your app, regardless of whether they use the default URL or any other custom domain.
   * For example, if set to hello.com, a user signing on at https://hello.com will receive the same identifier (principal) as when signing on at https://www.hello.com.
   * @type {string}
   * @optional
   */
  derivationOrigin?: string;

  /**
   * An optional list of external alternative origins allowed for authentication, which can be useful if you want to reuse the same derivation origin across multiple Satellites.
   * @type {string[]}
   * @optional
   */
  externalAlternativeOrigins?: string[];
}

/**
 * @see AuthenticationConfig
 */
export const AuthenticationConfigSchema = z.strictObject({
  internetIdentity: AuthenticationConfigInternetIdentitySchema.optional()
});

/**
 * Configures the Authentication options of a Satellite.
 * @interface AuthenticationConfig
 */
export interface AuthenticationConfig {
  /**
   * Optional configuration of Internet Identity authentication method.
   * @type {AuthenticationConfigInternetIdentity}
   * @optional
   */
  internetIdentity?: AuthenticationConfigInternetIdentity;

  /**
   * The timestamp when the config was created.
   * @type {bigint}
   * @optional
   */
  createdAt?: bigint;

  /**
   * The timestamp when the config was last updated.
   * @type {bigint}
   * @optional
   */
  updatedAt?: bigint;

  /**
   * The current version of the config.
   * @type {bigint}
   * @optional
   * @description Must be provided when updating the config to ensure the correct version is being updated.
   */
  version?: bigint;
}
