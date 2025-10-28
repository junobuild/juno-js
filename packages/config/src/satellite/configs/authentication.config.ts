import {type PrincipalText, PrincipalTextSchema} from '@dfinity/zod-schemas';
import * as z from 'zod';

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
 * @see AuthenticationConfigDelegation
 */
export const AuthenticationConfigDelegationSchema = z.strictObject({
  targets: z.array(PrincipalTextSchema).nullable().optional(),
  maxTimeToLive: z
    .bigint()
    .max(
      30n * 24n * 60n * 60n * 1_000_000_000n,
      'The maximal length of a defined session duration - maxTimeToLive - cannot exceed 30 days'
    )
    .optional()
});

/**
 * Configure the delegation behavior for authentication.
 *
 * @interface AuthenticationConfigDelegation
 */
export interface AuthenticationConfigDelegation {
  /**
   * By default, and for security reasons, the delegation/identities created by the
   * authentication module are restricted to interact only with your Satellite.
   *
   * Setting this to `null` explicitly removes the restriction, allowing identities
   * to interact with any canister on the Internet Computer, including ledgers.
   * ⚠️ Process with attention.
   */
  targets?: PrincipalText[] | null;

  /**
   * Maximum validity of the delegation, in nanoseconds.
   * Defaults to 1 day. Cannot exceed 30 days.
   */
  maxTimeToLive?: bigint;
}

/**
 * @see AuthenticationConfigGoogle
 */
export const AuthenticationConfigGoogleSchema = z.strictObject({
  clientId: z
    .string()
    .trim()
    .regex(/^[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com$/, 'Invalid Google client ID format')
    .max(128, 'Google clientId too long'),
  delegation: AuthenticationConfigDelegationSchema.optional()
});

/**
 * Configure the sign-in with Google.
 *
 * @interface AuthenticationConfigGoogle
 */
export interface AuthenticationConfigGoogle {
  /**
   * The OAuth 2.0 client ID from your
   * [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
   *
   * Example: `"1234567890-abcdefg.apps.googleusercontent.com"`
   *
   * @type {string}
   */
  clientId: string;

  /**
   * Optional delegation settings for authentication.
   * If omitted, the default delegation behavior applies.
   */
  delegation?: AuthenticationConfigDelegation;
}

/**
 * @see AuthenticationConfigRules
 */
export const AuthenticationConfigRulesSchema = z.strictObject({
  allowedCallers: z.array(PrincipalTextSchema)
});

/**
 * Configure the rules of the authentication.
 * @interface AuthenticationConfigRules
 */
export interface AuthenticationConfigRules {
  /**
   * This option defines who's allowed to use your app.
   *
   * If you enable this, only the identities you list (in user key, format, like `bj4r4-5cdop-...`) will be allowed to sign in or use any features like Datastore or Storage.
   *
   * @type {PrincipalText[]}
   * @optional
   */
  allowedCallers: PrincipalText[];
}

/**
 * @see AuthenticationConfig
 */
export const AuthenticationConfigSchema = z.strictObject({
  internetIdentity: AuthenticationConfigInternetIdentitySchema.optional(),
  google: AuthenticationConfigGoogleSchema.optional(),
  rules: AuthenticationConfigRulesSchema.optional(),
  version: z.bigint().optional()
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
   * Optional configuration for enabling Google authentication method.
   * @type {AuthenticationConfigGoogle}
   * @optional
   */
  google?: AuthenticationConfigGoogle;

  /**
   * Optional configuration for the rules of the authentication.
   * @type {AuthenticationConfigRules}
   * @optional
   */
  rules?: AuthenticationConfigRules;

  /**
   * The current version of the config.
   *
   * Optional. The CLI will automatically resolve the version and warn you if there's a potential overwrite.
   * You can provide it if you want to manage versioning manually within your config file.
   *
   * @type {bigint}
   * @optional
   */
  version?: bigint;
}
