import type {Identity} from '@dfinity/agent';
import type {Principal} from '@dfinity/principal';
import type {PrincipalText} from '@dfinity/zod-schemas';
import {PrincipalTextSchema} from '@dfinity/zod-schemas/dist/types/principal';
import * as z from 'zod/v4';
import {StrictIdentitySchema} from '../utils/identity.utils';
import {StrictPrincipalSchema} from '../utils/principal.utils';

/**
 * @see SatelliteContext
 */
const SatelliteContextSchema = z.strictObject({
  satelliteId: z.union([PrincipalTextSchema, StrictPrincipalSchema]),
  identity: StrictIdentitySchema
});

/**
 * Parameters required to call a Satellite from a task.
 */
export interface SatelliteContext {
  /**
   * The Satellite ID as defined in the `juno.config` file.
   *
   * This can be either a textual representation
   * or a {@link Principal} instance.
   */
  satelliteId: PrincipalText | Principal;

  /**
   * The {@link Identity} used by the CLI for this execution,
   * resolved according to the selected mode and profile.
   */
  identity: Identity;
}

/**
 * @see OnTaskRunContext
 */
export const OnTaskRunContextSchema = z.strictObject({
  satellite: SatelliteContextSchema
});

/**
 * The context for running a task.
 */
export interface OnTaskRunContext {
  /**
   * Context of the current Satellite, used to perform signed API calls
   * and feature executions.
   */
  satellite: SatelliteContext;
}

/**
 * @see TaskRunFunction
 */
const TaskRunFunctionSchema = z.function({
  input: z.tuple([OnTaskRunContextSchema]),
  output: z.promise(z.void()).or(z.void())
});

/**
 * The function executed by a task.
 */
export type TaskRunFunction = (context: OnTaskRunContext) => void | Promise<void>;

/**
 * @see OnTask
 */
export const OnTaskSchema = z.strictObject({
  run: TaskRunFunctionSchema
});

/**
 * A task executed with `juno run`.
 */
export interface OnTask {
  /**
   * The function executed by the task.
   */
  run: TaskRunFunction;
}
