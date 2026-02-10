import {
  signIn,
  WebAuthnSignInProgressStep,
  type SignProgress,
  type SignProgressFn,
} from "@junobuild/core";
import { useEffect, useState } from "react";
import type { PasskeyProps } from "../../types/passkey.ts";
import { Progress } from "./Progress.tsx";
import { Button } from "../Button.tsx";

export const UsePasskey = ({
  progress: wizardProgress,
  onProgress: wizardOnProgress,
}: PasskeyProps) => {
  const [progress, setProgress] = useState<
    SignProgress<WebAuthnSignInProgressStep> | undefined | null
  >(undefined);

  const onProgress: SignProgressFn<WebAuthnSignInProgressStep> = (progress) =>
    wizardOnProgress({ signIn: progress });

  useEffect(() => {
    if (wizardProgress === undefined) {
      setProgress(undefined);
      return;
    }

    setProgress("signIn" in wizardProgress ? wizardProgress.signIn : null);
  }, [wizardProgress]);

  const doSignIn = async () => {
    try {
      await signIn({
        webauthn: {
          options: { onProgress },
        },
      });
    } catch (error: unknown) {
      wizardOnProgress(undefined);

      // IRL the error would be gracefully displayed to the user unless
      // it is one to ignore - for example when the user cancel the flow.
      throw error;
    }
  };

  return (
    <>
      {progress === null ? (
        <></>
      ) : progress === undefined ? (
        <>
          <p className="pt-6">Already got one set-up?</p>

          <Button onClick={doSignIn}>Use your passkey</Button>
        </>
      ) : (
        <Progress>
          {progress?.step ===
            WebAuthnSignInProgressStep.RequestingUserCredential && (
            <span>Requesting user credential...</span>
          )}
          {progress?.step ===
            WebAuthnSignInProgressStep.FinalizingCredential && (
            <span>Finalizing credential...</span>
          )}
          {progress?.step === WebAuthnSignInProgressStep.Signing && (
            <span>Signing request...</span>
          )}
          {progress?.step === WebAuthnSignInProgressStep.FinalizingSession && (
            <span>Finalizing session...</span>
          )}
          {progress?.step === WebAuthnSignInProgressStep.RetrievingUser && (
            <span>Loading user...</span>
          )}
        </Progress>
      )}
    </>
  );
};
