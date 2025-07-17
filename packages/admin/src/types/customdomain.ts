/**
 * Represents a custom domain configuration.
 * @interface
 */
export interface CustomDomain {
  /**
   * The custom domain name.
   * @type {string}
   */
  domain: string;

  /**
   * The boundary nodes ID associated with the custom domain.
   * @type {string}
   * @optional
   */
  bn_id?: string;

  /**
   * The timestamp when the custom domain was last updated.
   * @type {bigint}
   */
  updated_at: bigint;

  /**
   * The timestamp when the custom domain was created.
   * @type {bigint}
   */
  created_at: bigint;

  /**
   * The version of the custom domain.
   * @type {bigint}
   * @optional
   */
  version?: bigint;
}
