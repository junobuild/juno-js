/**
 * Progress steps in the WebAuthn signing flow.
 */
export enum WebAuthnSignProgressStep {
  /** Calling `navigator.credentials.get` to obtain an assertion. */
  RequestingUserCredential,
  /** Verifying/initializing the credential (e.g., ID match, loading public key). */
  FinalizingCredential,
  /** Producing the signature and encoding the result. */
  Signing
}

/**
 * Status of the current step.
 */
export type WebAuthnSignProgressState = 'in_progress' | 'success' | 'error';

/**
 * Payload emitted on progress updates.
 */
export interface WebAuthnSignProgress {
  /** The step being executed. */
  step: WebAuthnSignProgressStep;
  /** State of that step. */
  state: WebAuthnSignProgressState;
}

/**
 * Callback invoked on each progress update.
 */
export type WebAuthnSignProgressFn = (progress: WebAuthnSignProgress) => void;

/**
 * Optional handler for progress updates.
 */
export interface WebAuthnSignProgressArgs {
  onProgress?: WebAuthnSignProgressFn;
}
