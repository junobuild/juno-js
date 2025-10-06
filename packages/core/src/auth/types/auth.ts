import type {InternetIdentitySignInOptions} from './internet-identity';
import type {MetamaskSignInOptions} from './metamask';
import type {NFIDSignInOptions} from './nfid';
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
 * - `internetIdentity`: Internet Identity options
 * - `nfid`: NFID options
 * - `webauthn`: WebAuthn/Passkey options
 * - `metamask`: MetaMask / Ethereum Signer options
 */
export type SignInOptions =
  | {
      internet_identity: {
        options?: InternetIdentitySignInOptions;
        context?: SignInContext;
      };
    }
  | {
      nfid: {options: NFIDSignInOptions; context?: SignInContext};
    }
  | {
      webauthn: {options?: WebAuthnSignInOptions; context?: SignInContext};
    }
  | {
      metamask: {options: MetamaskSignInOptions; context?: SignInContext};
    };

/**
 * The options for sign-up.
 *
 * - `webauthn`: WebAuthn/Passkey options
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
