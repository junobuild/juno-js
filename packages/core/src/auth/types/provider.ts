/**
 * Type representing the available authentication providers.
 * @typedef {('internet_identity' | 'nfid' | 'webauthn')} Provider
 */
export type Provider = 'internet_identity' | 'nfid' | 'webauthn' | 'metamask';

/**
 * Metadata for WebAuthn authentication.
 * @interface ProviderDataWebAuthn
 */
export interface ProviderDataWebAuthn {
  /**
   * Authenticator Attestation GUID (AAGUID).
   *
   * If available, a 16-byte identifier that uniquely represents the model of the authenticator,
   * unlesss the provider explicitly set it to zeros.
   */
  aaguid: Uint8Array | number[];
}

/**
 * Container for provider-specific metadata.
 *
 * Currently only `webauthn` is supported, but this type
 * can be extended in the future.
 *
 * @interface ProviderData
 */
export interface ProviderData {
  /**
   * Metadata specific to WebAuthn (passkey) authentication.
   */
  webauthn: ProviderDataWebAuthn;
}
