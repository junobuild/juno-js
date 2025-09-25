import type {Identity} from '@icp-sdk/core/agent';
import type {Principal} from '@icp-sdk/core/principal';
import * as z from 'zod/v4';
import {StrictIdentitySchema} from '../utils/identity.utils';
import {StrictPrincipalSchema} from '../utils/principal.utils';
import {createFunctionSchema} from '../utils/zod.utils';

/**
 * @see OnRunContext
 */
export const OnRunContextSchema = z.strictObject({
  satelliteId: StrictPrincipalSchema,
  identity: StrictIdentitySchema,
  container: z.string().optional()
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

  /**
   * A custom container URL. Useful when your local emulator runs on a non-default URL or port.
   * @type {string}
   * @optional
   */
  container?: string;
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
 * @see OnRun
 */
export const OnRunSchema = z.strictObject({
  run: createFunctionSchema(RunFunctionSchema)
});

/**
 * A runner (job) executed with `juno run`.
 */
export interface OnRun {
  /**
   * The function that will be executed and called with parameters
   * inherited from your configuration and CLI.
   */
  run: RunFunction;
}
