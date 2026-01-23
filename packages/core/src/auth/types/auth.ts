import type {GitHubHandleRedirectCallbackOptions, GitHubSignInRedirectOptions} from './github';
import type {GoogleSignInRedirectOptions} from './google';
import type {InternetIdentitySignInOptions} from './internet-identity';
import type {WebAuthnSignInOptions, WebAuthnSignUpOptions} from './webauthn';

/**
 * Options for the context of the sign-in flow.
 */
export interface SignInContext {
  /**
   * Opt out of the beforeunload window guard for the sign-in which prevents
   * the user to closing the current window/tab while the sign-in flow is in progress.
   *
   * Disabling it is discouraged.
   *
   * @default true
   */
  windowGuard?: boolean;
}

/**
 * Defines which provider to use for signing in and its associated options.
 *
 * - `google` — Google sign-in
 * - `github` — GitHub sign-in
 * - `internet_identity` — Internet Identity
 * - `webauthn` — WebAuthn/Passkeys
 */
export type SignInOptions =
  | {
      google: {
        options?: GoogleSignInRedirectOptions;
      };
    }
  | {
      github: {
        options?: GitHubSignInRedirectOptions;
      };
    }
  | {
      internet_identity: {
        options?: InternetIdentitySignInOptions;
        context?: SignInContext;
      };
    }
  | {
      webauthn: {options?: WebAuthnSignInOptions; context?: SignInContext};
    };

/**
 * Defines which provider to use for signing up and its associated options.
 *
 * - `webauthn`: WebAuthn/Passkeys
 */
export interface SignUpOptions {
  webauthn: {options?: WebAuthnSignUpOptions; context?: SignInContext};
}

/**
 * The options for sign-out.
 */
export interface SignOutOptions {
  /**
   * Opt out of reloading the window after state and authentication
   * have been successfully cleared.
   *
   * @default true
   */
  windowReload?: boolean;
}

/**
 * Defines which redirect should be handled.
 *
 * - `google`: Google sign-in
 * - `github`: GitHub sign-in
 */
export type HandleRedirectCallbackOptions =
  | {google: null}
  | {
      github: {
        options: GitHubHandleRedirectCallbackOptions;
      } | null;
    };
