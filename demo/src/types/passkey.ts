import {
  WebAuthnSignInProgressStep,
  SignProgress,
  WebAuthnSignUpProgressStep,
} from "@junobuild/core";

export type PasskeyProgress =
  | {
      signUp: SignProgress<WebAuthnSignUpProgressStep>;
    }
  | {
      signIn: SignProgress<WebAuthnSignInProgressStep>;
    }
  | { setup: null };

export interface PasskeyProps {
  progress: PasskeyProgress | undefined;
  // eslint-disable-next-line no-unused-vars
  onProgress: (progress: PasskeyProgress | undefined) => void;
}
