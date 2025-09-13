import type {PublicKey} from '@dfinity/agent';
import type {CoseEncodedKey} from '../agent-js/cose-key';
import type {CreatePasskeyOptions, PasskeyOptions} from './passkey';
import type {WebAuthnSignProgressArgs} from './progress';

/**
 * We extend the PublicKey type to enforce the presence of the toRaw function.
 */
export type PublicKeyWithToRaw = Omit<PublicKey, 'toRaw'> & Required<Pick<PublicKey, 'toRaw'>>;

/**
 * Fetches the COSE-encoded public key for a known credential.
 *
 * When creating a `WebAuthnIdentity` for an existing passkey, the authenticator
 * does not return the public key via `navigator.credentials.get`, therefore it
 * must be loaded another way. Commonly, you store this public information in
 * your backend and use this function to fetch it during the sign-in process.
 *
 * @param params.credentialId Credential ID (`rawId`) bytes.
 * @returns Promise resolving to the COSE-encoded public key.
 */
export type RetrievePublicKeyFn = (params: {credentialId: Uint8Array}) => Promise<CoseEncodedKey>;

/**
 * Options for requesting or retrieving a passkey with a device or browser.
 * * @typeParam T - Passkey-specific options forwarded to the underlying usage.
 */
export interface AuthenticatorOptions<T extends PasskeyOptions> {
  /**
   * Abort timeout (ms) for `navigator.credentials.*`.
   */
  timeout?: number;
  /**
   * Your custom options when creating or getting the passkey.
   */
  passkeyOptions?: T;
}

/**
 * Args for creating a new passkey and initializing a new WebAuthn identity.
 */
export type CreateWebAuthnIdentityWithNewCredentialArgs =
  AuthenticatorOptions<CreatePasskeyOptions> & WebAuthnSignProgressArgs;

/**
 * Args for retrieving an existing passkey and initializing a new WebAuthn identity..
 */
export type CreateWebAuthnIdentityWithExistingCredentialArgs =
  AuthenticatorOptions<PasskeyOptions> & {
    retrievePublicKey: RetrievePublicKeyFn;
  } & WebAuthnSignProgressArgs;
