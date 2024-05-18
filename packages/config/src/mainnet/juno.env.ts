/**
 * Represents the mode of the Juno configuration.
 * @typedef {'production' | string} JunoConfigMode
 */
export type JunoConfigMode = 'production' | string;

/**
 * Represents the environment configuration for Juno.
 * @interface JunoConfigEnv
 */
export interface JunoConfigEnv {
  /**
   * The mode of the Juno configuration.
   * @type {JunoConfigMode}
   */
  mode: JunoConfigMode;
}
