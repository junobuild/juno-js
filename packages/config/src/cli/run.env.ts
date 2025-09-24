import * as z from 'zod/v4';
import {type JunoConfigEnv, JunoConfigEnvSchema} from '../types/juno.env';

/**
 * @see OnRunEnv
 */
export const OnRunEnvSchema = JunoConfigEnvSchema.extend({
  profile: z.string().optional()
});

/**
 * The environment available when executing `juno run`.
 */
export type OnRunEnv = JunoConfigEnv & {
  /**
   * Optional profile (e.g. `personal`, `team`) used for execution.
   */
  profile?: string;
};
