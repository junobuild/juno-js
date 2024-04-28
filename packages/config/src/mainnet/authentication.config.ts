/**
 * Configure the behavior of Internet Identity.
 */
export interface AuthenticationConfigInternetIdentity {
  /**
   * This setting ensures that users are recognized on your app, regardless of whether they use the default URL or any other custom domain.
   * For example, if set to hello.com, a user signing on at https://hello.com will receive the same identifier (principal) as when signing on at https://www.hello.com.
   */
  derivationOrigin?: string;
}

/**
 * Configures the Authentication options of a Satellite.
 */
export interface AuthenticationConfig {
  /**
   * Optional configuration of Internet Identity authentication method.
   */
  internetIdentity?: AuthenticationConfigInternetIdentity;
}
