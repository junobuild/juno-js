import { signIn } from "@junobuild/core";
import type { FC } from "react";
import { Button } from "./Button";

export const LoginWitII: FC = () => {
  const signWithII = async () => {
    await signIn({
      internet_identity: {},
    });
  };

  return <Button onClick={signWithII}>Continue with Internet Identity</Button>;
};
