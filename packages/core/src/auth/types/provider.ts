/**
 * @deprecated The support for `nfid` provider is deprecated.
 */
export type DeprecatedNfid = 'nfid';

/**
 * Type representing the authentication providers.
 * @typedef {('internet_identity' | 'nfid' | 'webauthn' | 'google' | 'github')} Provider
 */
export type Provider = 'internet_identity' | DeprecatedNfid | 'webauthn' | 'google' | 'github';

/**
 * Subset of authentication providers that do not include any provider-specific metadata.
 */
export type ProviderWithoutData =
  | Extract<Provider, 'internet_identity' | DeprecatedNfid>
  | undefined;

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
 * Metadata associated with a given authentication provider.
 *
 * For example:
 * - `'webauthn'` → WebAuthn attestation details
 * - `'openid'` → OpenID profile information (e.g. Google)
 *
 * Other providers have no associated metadata.
 */
export type ProviderData<P extends 'webauthn' | 'openid'> = P extends 'webauthn'
  ? {webauthn: ProviderDataWebAuthn}
  : P extends 'openid'
    ? {openid: ProviderDataOpenId}
    : never;
