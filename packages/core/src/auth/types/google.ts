export type AuthScope = 'openid' | 'profile' | 'email';

/**
 * Combination of OAuth scopes supported by Google.
 *
 * According to Google’s OpenID Connect documentation:
 * The `scope` parameter must begin with `'openid'` and include `'profile'`, `'email'`, or both.
 *
 * - `'openid'` is always required.
 * - `'profile'` and `'email'` are optional individually, but at least one must be included.
 *
 * @see https://developers.google.com/identity/openid-connect/openid-connect?utm_source=chatgpt.com#authenticationuriparameters
 */
export type GoogleAuthScopes =
  | ['openid', 'profile']
  | ['openid', 'email']
  | ['openid', 'profile', 'email'];

/**
 * Sign-in options for the Google provider.
 * @interface GoogleSignInOptions
 */
export interface GoogleSignInOptions {
  /**
   * Redirect configuration.
   */
  redirect?: GoogleSignInRedirectOptions;
}

/**
 * Redirect options for Google sign-in.
 */
export interface GoogleSignInRedirectOptions {
  /**
   * Google OAuth client ID.
   * If omitted, the library attempts to read it from `juno.config`.
   */
  clientId?: string;

  /**
   * OAuth scopes to request.
   * Must begin with `'openid'` and include `'profile'`, `'email'`, or both.
   * @default ['openid', 'profile', 'email']
   */
  authScopes?: GoogleAuthScopes;

  /**
   * Redirect URL after authentication.
   * @default window.location.origin
   */
  redirectUrl?: string;

  /**
   * Optional hint about which user is trying to sign in — usually an email address
   * or a Google account ID. When provided, Google can potentially skip the account-picker
   * screen or prefill the login form for a smoother sign-in experience.
   */
  loginHint?: string;
}
