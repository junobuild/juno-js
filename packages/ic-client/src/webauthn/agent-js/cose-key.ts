import type {DerEncodedPublicKey, PublicKey} from '@dfinity/agent';
import {_coseToDerEncodedBlob} from './cose-utils';

/**
 * ⚠️ !!!WARNING!!! ⚠️
 * This module is a copy/paste of the webauthn classes not exposed by Agent-js.
 * It is therefore not covered by any tests (‼️) in this library.
 *
 * @see https://github.com/dfinity/agent-js/blob/main/packages/identity/src/identity/webauthn.ts
 */

/**
 * COSE-encoded key (CBOR Object Signing and Encryption).
 * serialized as a Uint8Array.
 */
export type CoseEncodedKey = Uint8Array;

export class CosePublicKey implements PublicKey {
  protected _encodedKey: DerEncodedPublicKey;

  public constructor(protected _cose: CoseEncodedKey) {
    this._encodedKey = _coseToDerEncodedBlob(_cose);
  }

  public toDer(): DerEncodedPublicKey {
    return this._encodedKey;
  }
}
