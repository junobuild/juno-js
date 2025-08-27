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
 * @returns {ExtractAAGUIDResult} The extracted AAGUID or a reason it couldn’t be provided.
 *
 * @see https://web.dev/articles/webauthn-aaguid
 */
export const extractAAGUID = ({
  authData
}: {
  authData: Uint8Array;
}): {aaguid: string} | {invalidAuthData: null} | {unknownProvider: null} => {
  if (authData.byteLength < 37) {
    return {invalidAuthData: null};
  }

  if (authData.byteLength < 53) {
    return {invalidAuthData: null};
  }

  const hex = [...authData.slice(37, 53)]
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
