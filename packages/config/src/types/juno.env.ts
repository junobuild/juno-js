import * as z from 'zod/v4';

/**
 * @see JunoConfigMode
 */
export const JunoConfigModeSchema = z.union([z.literal('production'), z.string()]);

/**
 * Represents the mode of the Juno configuration.
 * @typedef {'production' | string} JunoConfigMode
 */
export type JunoConfigMode = 'production' | string;

/**
 * @see JunoConfigEnv
 */
export const JunoConfigEnvSchema = z.object({
  mode: JunoConfigModeSchema
});

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
