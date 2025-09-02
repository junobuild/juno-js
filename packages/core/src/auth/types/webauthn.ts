import type {CreatePasskeyOptions} from '@junobuild/ic-client/webauthn';
import type {SignProgressFn} from './progress';

/**
 * Enum representing the different steps of the WebAuthn sign-in flow.
 */
export enum WebAuthnSignInProgressStep {
  /** Requesting a passkey (credential) from the user */
  RequestingUserCredential,
  /** Validating and finalizing the credential provided by the user */
  FinalizingCredential,
  /** Signing the authentication challenge with the user's credential */
  Signing,
  /** Completing the session setup after signing */
  FinalizingSession,
  /** Retrieving the authenticated user information */
  RetrievingUser
}

/**
 * Enum representing the different steps of the WebAuthn sign-up (registration) flow.
 */
export enum WebAuthnSignUpProgressStep {
  /** Creating a new passkey (credential) for the user */
  CreatingUserCredential,
  /** Validating the created credential */
  ValidatingUserCredential,
  /** Finalizing the credential for use */
  FinalizingCredential,
  /** Signing the registration challenge. Requires the user to interact again with the authenticator for confirmation. */
  Signing,
  /** Completing the session setup after signing */
  FinalizingSession,
  /** Registering the new user in the system */
  RegisteringUser
}

/**
 * Interface representing common sign-in and sing-up options when using a WebAuthn (passkey) based provider.
 * @interface WebAuthnSignOptions
 */
export interface WebAuthnSignOptions {
  /**
   * Maximum time to live for the session in milliseconds. Cannot be extended.
   * @type {number}
   */
  maxTimeToLiveInMilliseconds?: number;
}

/**
 * Interface representing sign-in options when using a WebAuthn (passkey) based provider.
 * @interface WebAuthnSignInOptions
 */
export interface WebAuthnSignInOptions extends WebAuthnSignOptions {
  /**
   * Optional callback to receive progress updates about the sign-in flow.
   * Useful for showing UI feedback such as loading indicators or status messages.
   */
  onProgress?: SignProgressFn<WebAuthnSignInProgressStep>;
}

/**
 * Interface representing sign-up options when using a WebAuthn (passkey) based provider.
 * @interface WebAuthnSignUpSessionOptions
 */
export interface WebAuthnSignUpOptions extends WebAuthnSignOptions {
  /**
   * Optional callback to receive progress updates about the sign-up flow.
   * Useful for showing UI feedback such as loading indicators or status messages.
   */
  onProgress?: SignProgressFn<WebAuthnSignUpProgressStep>;

  /**
   * Options for creating the passkey credential.
   *
   * For example, you can provide a user-friendly display name so the passkey
   * is easier to recognize later.
   */
  passkey?: CreatePasskeyOptions;
}
