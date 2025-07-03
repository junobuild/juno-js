import * as z from 'zod/v4';
import {type RawUserId, RawUserIdSchema} from '../../schemas/satellite';

/**
 * @see HookContext
 */
export const HookContextSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  const schemaShape = {
    caller: RawUserIdSchema,
    data: dataSchema
  };

  return z.strictObject(schemaShape);
};

/**
 * Represents the context provided to hooks, containing information about the caller and related data.
 *
 * @template T - The type of data associated with the hook.
 */
export interface HookContext<T> {
  /**
   * The user who originally triggered the function that in turn triggered the hook.
   */
  caller: RawUserId;

  /**
   * The data associated with the hook execution.
   */
  data: T;
}

/**
 * @see AssertFunction
 */
export const AssertFunctionSchema = <T extends z.ZodTypeAny>(_contextSchema: T) =>
  // TODO: We need a schema but
  // the Zod workaround https://github.com/colinhacks/zod/issues/4143#issuecomment-2845134912
  // lead to the issue https://github.com/colinhacks/zod/issues/4773
  z
    .any()
    .refine((val) => typeof val === 'function', {
      message: 'Expected a function'
    })
    .transform((val) => val)
    .describe('AssertFunction');

/**
 * Defines the `assert` function schema for assertions.
 *
 * The function takes a context argument and returns `void`.
 *
 * @template T - The type of context passed to the function.
 */
export type AssertFunction<T> = (context: T) => void;

/**
 * @see RunFunction
 */
export const RunFunctionSchema = <T extends z.ZodTypeAny>(_contextSchema: T) =>
  // TODO: We need a schema but
  // the Zod workaround https://github.com/colinhacks/zod/issues/4143#issuecomment-2845134912
  // lead to the issue https://github.com/colinhacks/zod/issues/4773
  z
    .any()
    .refine((val) => typeof val === 'function', {
      message: 'Expected a function'
    })
    .transform((val) => val)
    .describe('RunFunction');

/**
 * Defines the `run` function schema for hooks.
 *
 * The function takes a context argument and returns either a `Promise<void>` or `void`.
 *
 * @template T - The type of context passed to the function.
 */
export type RunFunction<T> = (context: T) => void | Promise<void>;
