import {uint8ArrayToArrayOfNumber} from '@dfinity/utils';

/**
 * Extracts the AAGUID (Authenticator Attestation GUID) from a WebAuthn data buffer.
 *
 * The AAGUID is a 16-byte value located at offsets 37..53 within `authenticatorData`
 * when **attested credential data** is present (i.e., during registration/attestation).
 *
 * For assertion (sign-in) responses, `authenticatorData` is typically 37 bytes and
 * does not include an AAGUID.
 *
 * If the extracted value is all zeros (`00000000-0000-0000-0000-000000000000`),
 * this function returns `{ unknownProvider: null }` since some passkey providers
 * intentionally use a zero AAGUID.
 *
 * @param {Object} params
 * @param {Uint8Array} params.authData - The WebAuthn `authenticatorData` bytes.
 * @returns {{aaguid: string; bytes: number[]} | {invalidAuthData: null} | {unknownProvider: null}}
 * - { aaguidText, aaguidBytes } for valid AAGUID
 * - { unknownProvider: null } for all-zero AAGUID
 * - { invalidAuthData: null } if `authData` is invalid (too short, too long, etc.)
 *
 * @see https://web.dev/articles/webauthn-aaguid
 */
export const extractAAGUID = ({
  authData
}: {
  authData: Uint8Array;
}):
  | {aaguidText: string; aaguidBytes: number[]}
  | {invalidAuthData: null}
  | {unknownProvider: null} => {
  if (authData.byteLength < 37) {
    return {invalidAuthData: null};
  }

  if (authData.byteLength < 53) {
    return {invalidAuthData: null};
  }

  const bytes = [...authData.slice(37, 53)];

  const result = bytesToAAGUID({bytes});

  if ('aaguid' in result) {
    return {aaguidBytes: bytes, aaguidText: result.aaguid};
  }

  return {unknownProvider: null};
};

/**
 * Convert 16 AAGUID bytes to canonical UUID string (lowercase, hyphenated).
 *
 * Returns:
 * - { aaguid } for non-zero AAGUIDs
 * - { unknownProvider: null } for all-zero AAGUID
 * - { invalidBytes: null } if length ≠ 16
 *
 * @param {{bytes: Uint8Array | number[]}} params
 * @returns {{aaguid: string} | {invalidBytes: null} | {unknownProvider: null}}
 */
export const bytesToAAGUID = ({
  bytes
}: {
  bytes: Uint8Array | number[];
}): {aaguid: string} | {invalidBytes: null} | {unknownProvider: null} => {
  if (bytes.length !== 16) {
    return {invalidBytes: null};
  }

  const hex = (bytes instanceof Uint8Array ? uint8ArrayToArrayOfNumber(bytes) : bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  const aaguid = hex.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

  // "00000000-0000-0000-0000-0000000000000" represents an unknown passkey provider. Some passkey providers use this AAGUID intentionally.
  // Source: https://web.dev/articles/webauthn-aaguid
  if (aaguid === '00000000-0000-0000-0000-000000000000') {
    return {unknownProvider: null};
  }

  return {aaguid};
};
