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
 * Represents the state of a WebAuthn progress step.
 * - `in_progress`: The step is currently being executed.
 * - `success`: The step completed successfully.
 * - `error`: The step failed.
 */
export type WebAuthnProgressState = 'in_progress' | 'success' | 'error';

/**
 * Progress event emitted during a WebAuthn sign-in or sign-up flow.
 */
export interface WebAuthnSignProgress<Step> {
  /** Current step in the sign-in flow */
  step: Step;
  /** State of the current step */
  state: WebAuthnProgressState;
}

/**
 * Callback type for receiving progress updates during the WebAuthn sign-in or sign-up process.
 */
export type WebAuthnSignProgressFn<Step> = (progress: WebAuthnSignProgress<Step>) => void;

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
  onProgress?: WebAuthnSignProgressFn<WebAuthnSignInProgressStep>;
}

/**
 * Interface representing sign-up options when using a WebAuthn (passkey) based provider.
 * @interface WebAuthnSignUpSessionOptions
 */
export interface WebAuthnSignUpSessionOptions extends WebAuthnSignOptions {
  /**
   * Optional callback to receive progress updates about the sign-up flow.
   * Useful for showing UI feedback such as loading indicators or status messages.
   */
  onProgress?: WebAuthnSignProgressFn<WebAuthnSignUpProgressStep>;
}
