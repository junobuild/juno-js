import type {PublicKey} from '@dfinity/agent';
import {uint8ArrayToBase64} from '@dfinity/utils';
import {CosePublicKey} from './_agent';
import type {CoseEncodedKey} from './types/agent';

export interface InitWebAuthnCredentialArgs {
  rawId: Uint8Array;
  cose: CoseEncodedKey;
}

export class WebAuthnCredential {
  readonly #credentialId: Uint8Array;
  readonly #publicKey: CosePublicKey;
  // TODO: more fields like AAGUID?

  constructor({rawId: credentialId, cose}: InitWebAuthnCredentialArgs) {
    this.#credentialId = credentialId;
    this.#publicKey = new CosePublicKey(cose);
  }

  getPublicKey(): PublicKey {
    return this.#publicKey;
  }

  getCredentialId(): Uint8Array {
    return this.#credentialId;
  }

  getCredentialIdText(): string {
    return uint8ArrayToBase64(this.#credentialId);
  }
}
