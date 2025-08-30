import type {AuthClientSignInOptions, InternetIdentityConfig, NFIDConfig} from './auth-client';
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
 * The options for sign-in.
 *
 * - `internetIdentity`: Internet Identity config + options
 * - `nfid`: NFID config (required) + popup options
 * - `webauthn`: WebAuthn/Passkey options
 */
export type SignInOptions =
  | {
      internet_identity: {
        config?: InternetIdentityConfig;
        options?: AuthClientSignInOptions;
        context?: SignInContext;
      };
    }
  | {
      nfid: {config: NFIDConfig; options?: AuthClientSignInOptions; context?: SignInContext};
    }
  | {
      webauthn: {options?: WebAuthnSignInOptions; context?: SignInContext};
    };

/**
 * The options for sign-up.
 *
 * - `webauthn`: WebAuthn/Passkey options
 */
export interface SignUpOptions {
  webauthn: {options?: WebAuthnSignUpOptions; context?: SignInContext};
}
