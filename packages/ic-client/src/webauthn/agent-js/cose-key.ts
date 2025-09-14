import type {DerEncodedPublicKey} from '@dfinity/agent';
import type {PublicKeyWithToRaw} from '../types/identity';
import {_coseToDerEncodedBlob} from './cose-utils';

/**
 * ⚠️ !!!WARNING!!! ⚠️
 * This module is a copy/paste of the webauthn classes not exposed by Agent-js
 * extended with mandatory toRaw().
 * It is therefore not covered by that many tests (‼️) in this library.
 *
 * @see https://github.com/dfinity/agent-js/blob/main/packages/identity/src/identity/webauthn.ts
 */

/**
 * COSE-encoded key (CBOR Object Signing and Encryption).
 * serialized as a Uint8Array.
 */
export type CoseEncodedKey = Uint8Array;

export class CosePublicKey implements PublicKeyWithToRaw {
  protected _encodedKey: DerEncodedPublicKey;

  public constructor(protected _cose: CoseEncodedKey) {
    this._encodedKey = _coseToDerEncodedBlob(_cose);
  }

  public toDer(): DerEncodedPublicKey {
    return this._encodedKey;
  }

  public toRaw(): Uint8Array {
    return new Uint8Array(this._encodedKey); // Strip __derEncodedPublicKey__
  }
}
