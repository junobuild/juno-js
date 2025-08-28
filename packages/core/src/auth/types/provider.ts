/**
 * Type representing the available authentication providers.
 * @typedef {('internet_identity' | 'nfid')} Provider
 */
export type Provider = 'internet_identity' | 'nfid';

/**
 * Common traits for all authentication providers
 * @interface AuthProvider
 */
export interface AuthProvider {
  /**
   * The unique identifier of the provider.
   */
  readonly id: Provider;
}
