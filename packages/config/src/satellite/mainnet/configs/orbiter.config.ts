/**
 * Represents the configuration for an orbiter.
 * @interface OrbiterConfig
 */
export interface OrbiterConfig {
  /**
   * The identifier of the orbiter used in the dApp.
   * @type {string}
   */
  id: string;

  /**
   * The deprecated identifier of the orbiter.
   * @deprecated `orbiterId` will be removed in the future. Use `id` instead.
   * @type {string}
   */
  orbiterId?: string;
}
