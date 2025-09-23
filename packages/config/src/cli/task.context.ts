import type {Identity} from '@dfinity/agent';
import type {Principal} from '@dfinity/principal';
import * as z from 'zod/v4';
import {StrictIdentitySchema} from '../utils/identity.utils';
import {StrictPrincipalSchema} from '../utils/principal.utils';
import {createFunctionSchema} from '../utils/zod.utils';

/**
 * @see OnRunContext
 */
export const OnRunContextSchema = z.strictObject({
  satelliteId: StrictPrincipalSchema,
  identity: StrictIdentitySchema
});

/**
 * The context for running a task.
 */
export interface OnRunContext {
  /**
   * The Satellite ID as defined in the `juno.config` file.
   *
   * A {@link Principal} instance.
   */
  satelliteId: Principal;

  /**
   * The {@link Identity} used by the CLI for this execution,
   * resolved according to the selected mode and profile.
   */
  identity: Identity;
}

/**
 * @see RunFunction
 */
const RunFunctionSchema = z.function({
  input: z.tuple([OnRunContextSchema]),
  output: z.promise(z.void()).or(z.void())
});
/**
 * The function executed by a task.
 */
export type RunFunction = (context: OnRunContext) => void | Promise<void>;

/**
 * @see OnTask
 */
export const OnTaskSchema = z.strictObject({
  run: createFunctionSchema(RunFunctionSchema)
});

/**
 * A task executed with `juno run`.
 */
export interface OnTask {
  /**
   * The function executed by the task.
   */
  run: RunFunction;
}
