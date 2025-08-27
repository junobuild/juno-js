import type {CoseEncodedKey} from './agent';
import type {CreatePasskeyOptions} from './passkey';
import type {WebAuthnSignProgressArgs} from './progress';

export type RetrievePublicKeyFn = (params: {credentialId: Uint8Array}) => Promise<CoseEncodedKey>;

export interface AuthenticatorOptions {
  timeout?: number;
  passkeyOptions?: CreatePasskeyOptions;
}

export type CreateWebAuthnIdentityWithNewCredentialArgs = AuthenticatorOptions & WebAuthnSignProgressArgs;

export type CreateWebAuthnIdentityWithExistingCredentialArgs = AuthenticatorOptions & {
  retrievePublicKey: RetrievePublicKeyFn;
} & WebAuthnSignProgressArgs;
