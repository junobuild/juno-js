import { Button } from "../Button.tsx";
import {
  WebAuthnSignUpProgressStep,
  type SignProgress,
  type SignProgressFn,
  signUp,
} from "@junobuild/core";
import { useEffect, useState } from "react";
import { Progress } from "./Progress.tsx";
import type { PasskeyProps } from "../../types/passkey.ts";

type ProgressSignUp =
  | {
      state: "init" | "setup" | "hidden";
    }
  | {
      state: "progress";
      detail: SignProgress<WebAuthnSignUpProgressStep>;
    };

export const CreatePasskey = ({
  progress: wizardProgress,
  onProgress: wizardOnProgress,
}: PasskeyProps) => {
  const [progress, setProgress] = useState<ProgressSignUp>({ state: "init" });
  const [inputText, setInputText] = useState("");

  const onProgress: SignProgressFn<WebAuthnSignUpProgressStep> = (progress) =>
    wizardOnProgress({ signUp: progress });

  useEffect(() => {
    if (wizardProgress === undefined) {
      setProgress({ state: "init" });
      return;
    }

    setProgress(
      "signUp" in wizardProgress
        ? { state: "progress", detail: wizardProgress.signUp }
        : "setup" in wizardProgress
          ? { state: "setup" }
          : { state: "hidden" },
    );
  }, [wizardProgress]);

  const goToSetup = () => {
    wizardOnProgress({ setup: null });
  };

  const doSignUp = async () => {
    try {
      await signUp({
        webauthn: {
          options: {
            onProgress,
            ...(inputText !== "" && {
              passkey: {
                user: {
                  displayName: inputText,
                },
              },
            }),
          },
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
      {progress.state === "init" ? (
        <>
          <p>
            First time here? Use your device (Face ID, Windows Hello, or screen
            lock) to get in.
          </p>

          <Button onClick={goToSetup}>Create a new passkey</Button>
        </>
      ) : progress.state === "setup" ? (
        <>
          <p>Want to give it a nickname so you&apos;ll spot it easily later?</p>

          <input
            className="mx-0 mt-2 mb-6 block w-full resize-none rounded-sm border-[3px] border-black bg-white px-3 py-1.5 text-base font-normal shadow-[5px_5px_0px_rgba(0,0,0,1)] focus:outline-hidden"
            placeholder="An optional nickname"
            onChange={(e) => {
              setInputText(e.target.value);
            }}
            value={inputText}
          ></input>

          <Button onClick={doSignUp}>Create now</Button>
        </>
      ) : progress.state === "progress" ? (
        <Progress>
          {progress?.detail.step ===
            WebAuthnSignUpProgressStep.CreatingUserCredential && (
            <span>Creating user credential...</span>
          )}
          {progress?.detail.step ===
            WebAuthnSignUpProgressStep.ValidatingUserCredential && (
            <span>Validating user credential...</span>
          )}
          {progress?.detail.step ===
            WebAuthnSignUpProgressStep.FinalizingCredential && (
            <span>Finalizing credential...</span>
          )}
          {progress?.detail.step === WebAuthnSignUpProgressStep.Signing && (
            <span>Signing request....</span>
          )}
          {progress?.detail.step ===
            WebAuthnSignUpProgressStep.FinalizingSession && (
            <span>Finalizing session...</span>
          )}
          {progress?.detail.step ===
            WebAuthnSignUpProgressStep.RegisteringUser && (
            <span>Registering user...</span>
          )}
        </Progress>
      ) : null}
    </>
  );
};
