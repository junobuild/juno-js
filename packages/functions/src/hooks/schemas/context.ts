import type {baseObjectInputType, baseObjectOutputType, ZodObject, ZodTypeAny} from 'zod';
import * as z from 'zod';
import {RawUserIdSchema} from '../../schemas/satellite';

/**
 * @see HookContext
 */
export const HookContextSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  const schemaShape = {
    /**
     * The user who originally triggered the function that in turn triggered the hook.
     */
    caller: RawUserIdSchema,

    /**
     * The data associated with the hook execution.
     */
    data: dataSchema
  };

  // TODO: workaround for https://github.com/colinhacks/zod/issues/3998
  return z.object(schemaShape).strict() as ZodObject<
    typeof schemaShape,
    'strict',
    ZodTypeAny,
    baseObjectOutputType<typeof schemaShape>,
    baseObjectInputType<typeof schemaShape>
  >;
};

/**
 * Represents the context provided to hooks, containing information about the caller and related data.
 *
 * @template T - The type of data associated with the hook.
 */
export type HookContext<T extends z.ZodTypeAny> = z.infer<ReturnType<typeof HookContextSchema<T>>>;

/**
 * @see AssertFunction
 */
export const AssertFunctionSchema = <T extends z.ZodTypeAny>(contextSchema: T) =>
  z.function().args(contextSchema).returns(z.void());

/**
 * Defines the `assert` function schema for assertions.
 *
 * The function takes a context argument and returns `void`.
 *
 * @template T - The type of context passed to the function.
 */
export type AssertFunction<T> = z.infer<ReturnType<typeof AssertFunctionSchema<z.ZodType<T>>>>;

/**
 * @see RunFunction
 */
export const RunFunctionSchema = <T extends z.ZodTypeAny>(contextSchema: T) =>
  z.function().args(contextSchema).returns(z.promise(z.void()).or(z.void()));

/**
 * Defines the `run` function schema for hooks.
 *
 * The function takes a context argument and returns either a `Promise<void>` or `void`.
 *
 * @template T - The type of context passed to the function.
 */
export type RunFunction<T> = z.infer<ReturnType<typeof RunFunctionSchema<z.ZodType<T>>>>;
