/**
 * @deprecated The support for `nfid` provider is deprecated.
 */
export type DeprecatedNfid = 'nfid';

/**
 * Type representing the authentication providers.
 * @typedef {('internet_identity' | 'nfid' | 'webauthn' | 'google')} Provider
 */
export type Provider = 'internet_identity' | DeprecatedNfid | 'webauthn' | 'google';

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
 * Metadata for OpenID (e.g. Google) authentication.
 * @interface ProviderDataOpenId
 */
export interface ProviderDataOpenId {
  /**
   * Email address of the authenticated user.
   */
  email?: string;

  /**
   * Full name of the authenticated user.
   */
  name?: string;

  /**
   * Given name of the authenticated user.
   */
  givenName?: string;

  /**
   * Family name of the authenticated user.
   */
  familyName?: string;

  /**
   * Profile picture URL of the authenticated user.
   */
  picture?: string;

  /**
   * Locale of the authenticated user.
   */
  locale?: string;
}

/**
 * Container for provider-specific metadata.
 *
 * @typedef {({ webauthn: ProviderDataWebAuthn } | { openid: ProviderDataOpenId })} ProviderData
 */
export type ProviderData = {webauthn: ProviderDataWebAuthn} | {openid: ProviderDataOpenId};
