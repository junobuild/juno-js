import type {PublicKey} from '@dfinity/agent';
import {uint8ArrayToBase64} from '@dfinity/utils';
import {extractAAGUID} from './_aaguid';
import {type CoseEncodedKey, CosePublicKey} from './agent-js/cose-key';

/**
 * Arguments to initialize a WebAuthn object.
 */
export interface InitWebAuthnCredentialArgs {
  /**
   * The credential ID (authenticator’s `rawId`) as bytes.
   */
  rawId: Uint8Array;

  /**
   * COSE-encoded public key extracted from attestation/authData.
   */
  cose: CoseEncodedKey;
}

export interface InitWebAuthnNewCredentialArgs extends InitWebAuthnCredentialArgs {
  /**
   * The authenticator data from the attestation.
   */
  authData: Uint8Array;
}

/**
 * A wrapper around a WebAuthn credential that provides various base information such as its ID or public key.
 */
export abstract class WebAuthnCredential {
  readonly #credentialId: Uint8Array;
  readonly #publicKey: CosePublicKey;

  /**
   * @param args - {@link InitWebAuthnCredentialArgs} used to initialize the credential.
   * @param args.rawId - Credential ID (`rawId`) as bytes.
   * @param args.cose - COSE-encoded public key.
   */
  constructor({rawId: credentialId, cose}: InitWebAuthnCredentialArgs) {
    this.#credentialId = credentialId;
    this.#publicKey = new CosePublicKey(cose);
  }

  /**
   * Returns the public key for this credential.
   */
  getPublicKey(): PublicKey {
    return this.#publicKey;
  }

  /**
   * Returns the credential ID as bytes.
   */
  getCredentialId(): Uint8Array {
    return this.#credentialId;
  }

  /**
   * Returns the credential ID as textual representation (a base64 string).
   */
  getCredentialIdText(): string {
    return uint8ArrayToBase64(this.#credentialId);
  }
}

/**
 * A wrapper around a newly created WebAuthn credential.
 * It is created using `navigator.credentials.create` which provides an attestation.
 */
export class WebAuthnNewCredential extends WebAuthnCredential {
  readonly #aaguid: string | undefined;

  /**
   * @param args - {@link InitWebAuthnNewCredentialArgs} used to initialize the credential.
   * @param args.rawId - Credential ID (`rawId`) as bytes.
   * @param args.cose - COSE-encoded public key.
   * @params args.authData - Authenticator data from the attestation.
   */
  constructor({authData, ...rest}: InitWebAuthnNewCredentialArgs) {
    super(rest);

    const optionAaguid = extractAAGUID({authData});
    this.#aaguid = 'aaguid' in optionAaguid ? optionAaguid.aaguid : undefined;
  }

  /**
   * Returns the AAGUID (Authenticator Attestation GUID).
   */
  getAAGUID(): string | undefined {
    return this.#aaguid;
  }
}

/**
 * A wrapper around a retrieval of existing WebAuthn credential.
 * It is created using `navigator.credentials.get` which provides an assertion.
 */
export class WebAuthnExistingCredential extends WebAuthnCredential {}
