export enum WebAuthnSignProgressStep {
  RequestingUserCredential,
  FinalizingCredential,
  Signing
}

export type WebAuthnSignProgressState = 'in_progress' | 'success' | 'error';

export interface WebAuthnSignProgress {
  step: WebAuthnSignProgressStep;
  state: WebAuthnSignProgressState;
}

export type WebAuthnSignProgressFn = (progress: WebAuthnSignProgress) => void;

export interface WebAuthnSignProgressArgs {
  onProgress?: WebAuthnSignProgressFn;
}
