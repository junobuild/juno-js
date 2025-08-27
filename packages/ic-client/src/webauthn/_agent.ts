import {DER_COSE_OID, wrapDER, type DerEncodedPublicKey, type PublicKey} from '@dfinity/agent';

/**
 * ⚠️ !!!WARNING!!! ⚠️
 * This module is a copy/paste of the webauthn functions and classes not exposed by Agent-js.
 * It is therefore not covered by any tests (‼️) in this library.
 *
 * @see https://github.com/dfinity/agent-js/blob/main/packages/identity/src/identity/webauthn.ts
 */

/**
 * From the documentation;
 * The authData is a byte array described in the spec. Parsing it will involve slicing bytes from
 * the array and converting them into usable objects.
 *
 * See https://webauthn.guide/#registration (subsection "Example: Parsing the authenticator data").
 * @param authData The authData field of the attestation response.
 * @returns The COSE key of the authData.
 */
export function _authDataToCose(authData: Uint8Array): Uint8Array {
  const dataView = new DataView(new ArrayBuffer(2));
  const idLenBytes = authData.slice(53, 55);
  [...new Uint8Array(idLenBytes)].forEach((v, i) => dataView.setUint8(i, v));
  const credentialIdLength = dataView.getUint16(0);

  // Get the public key object.
  return authData.slice(55 + credentialIdLength);
}

function _coseToDerEncodedBlob(cose: Uint8Array): DerEncodedPublicKey {
  return wrapDER(cose.buffer as ArrayBuffer, DER_COSE_OID).buffer as DerEncodedPublicKey;
}

// COSE = CBOR Object Signing and Encryption
export type CoseEncodedKey = Uint8Array;

export class CosePublicKey implements PublicKey {
  protected _encodedKey: DerEncodedPublicKey;

  public constructor(protected _cose: CoseEncodedKey) {
    this._encodedKey = _coseToDerEncodedBlob(_cose);
  }

  public toDer(): DerEncodedPublicKey {
    return this._encodedKey;
  }

  public getCose(): Uint8Array {
    return this._cose;
  }
}
