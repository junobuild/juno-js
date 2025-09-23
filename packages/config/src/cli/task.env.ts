import * as z from 'zod/v4';
import {type JunoConfigEnv, JunoConfigEnvSchema} from '../types/juno.env';

/**
 * @see OnTaskEnv
 */
export const OnTaskEnvSchema = JunoConfigEnvSchema.extend({
  profile: z.string().optional()
});

/**
 * The environment available when running a task with `juno run`.
 */
export type OnTaskEnv = JunoConfigEnv & {
  /**
   * Optional profile (e.g. `personal`, `team`) used for execution.
   */
  profile?: string;
};
