/**
 * OAuth scopes supported by GitHub.
 * Only applicable for OAuth Apps - GitHub Apps use permissions configured in app settings.
 *
 * - `'read:user'` is always required.
 * - `'user:email'` is optional.
 *
 * @see https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
 */
export type GitHubAuthScopes = ['read:user', 'user:email'] | ['read:user'];

/**
 * Sign-in options for the GitHub provider using a redirect flow.
 * @interface GitHubSignInRedirectOptions
 */
export interface GitHubSignInRedirectOptions {
  /**
   * Redirect configuration.
   */
  redirect?: GitHubRedirectOptions;
}

/**
 * Redirect options for GitHub sign-in.
 */
export interface GitHubRedirectOptions {
  /**
   * GitHub OAuth client ID.
   * If omitted, the library attempts to read it from `juno.config`.
   */
  clientId?: string;

  /**
   * OAuth scopes to request.
   * Optional - only used for OAuth Apps. GitHub Apps ignore this parameter.
   * @default ['read:user', 'user:email']
   */
  authScopes?: GitHubAuthScopes;

  /**
   * Redirect URL after authentication.
   * @default window.location.origin
   */
  redirectUrl?: string;

  /**
   * Initialization URL. Useful for local development or to interact with a self-hosted API.
   * @default https://api.juno.build/v1/auth/init/github
   */
  initUrl?: string;
}

/**
 * Options for handling GitHub redirect callback.
 */
export interface GitHubHandleRedirectCallbackOptions {
  /**
   * Finalization URL. Useful for local development or to interact with a self-hosted API.
   * @default https://api.juno.build/v1/auth/finalize/github
   */
  finalizeUrl?: string;
}
