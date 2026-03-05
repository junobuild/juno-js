import * as z from 'zod';
import {type SatelliteEnv, SatelliteEnvSchema} from '../schemas/satellite.env';
import {createFunctionSchema} from '../utils/zod.utils';
import {__JUNO_FUNCTION_TYPE} from './constants';
import {
  type CustomFunctionWithArgs,
  type CustomFunctionWithArgsAndResult,
  type CustomFunctionWithoutArgsAndResult,
  type CustomFunctionWithResult,
  CustomFunctionWithArgsAndResultSchema,
  CustomFunctionWithArgsSchema,
  CustomFunctionWithoutArgsAndResultSchema,
  CustomFunctionWithResultSchema
} from './schemas/function';

const UpdateBaseSchema = z.strictObject({
  type: z.literal(__JUNO_FUNCTION_TYPE.UPDATE)
});

/**
 * @see Update
 */
export const UpdateSchema = z.union([
  z.strictObject({
    ...CustomFunctionWithArgsAndResultSchema.shape,
    ...UpdateBaseSchema.shape
  }),
  z.strictObject({
    ...CustomFunctionWithArgsSchema.shape,
    ...UpdateBaseSchema.shape
  }),
  z.strictObject({
    ...CustomFunctionWithResultSchema.shape,
    ...UpdateBaseSchema.shape
  }),
  z.strictObject({
    ...CustomFunctionWithoutArgsAndResultSchema.shape,
    ...UpdateBaseSchema.shape
  })
]);

/**
 * The input shape for defining a update serverless function.
 * Does not include `type`, which is injected by `defineUpdate`.
 */
export type Update<TArgs = unknown, TResult = unknown> =
  | Omit<CustomFunctionWithArgsAndResult<TArgs, TResult>, 'type'>
  | Omit<CustomFunctionWithArgs<TArgs>, 'type'>
  | Omit<CustomFunctionWithResult<TResult>, 'type'>
  | Omit<CustomFunctionWithoutArgsAndResult, 'type'>;

/**
 * A update function definition with `type` injected by `defineUpdate`.
 * Queries are read-only functions that do not modify state.
 */
export type UpdateDefinition<TArgs = unknown, TResult = unknown> = Update<TArgs, TResult> & {
  type: typeof __JUNO_FUNCTION_TYPE.UPDATE;
};

export const UpdateFnSchema = <T extends z.ZodTypeAny>(updateSchema: T) =>
  z.function({input: z.tuple([SatelliteEnvSchema]), output: updateSchema});

/**
 * A factory function that receives the satellite environment and returns a update definition.
 */
export type UpdateFn<TArgs, TResult> = (env: SatelliteEnv) => Update<TArgs, TResult>;

export const UpdateFnOrObjectSchema = <T extends z.ZodTypeAny>(updateSchema: T) =>
  z.union([updateSchema, createFunctionSchema(UpdateFnSchema(updateSchema))]);

/**
 * An update definition or a factory function that returns one.
 */
export type UpdateFnOrObject<TArgs, TResult> = Update<TArgs, TResult> | UpdateFn<TArgs, TResult>;

export function defineUpdate<TArgs, TResult>(
  update: Update<TArgs, TResult>
): UpdateDefinition<TArgs, TResult>;
export function defineUpdate<TArgs, TResult>(
  update: UpdateFn<TArgs, TResult>
): (env: SatelliteEnv) => UpdateDefinition<TArgs, TResult>;
export function defineUpdate<TArgs, TResult>(
  update: UpdateFnOrObject<TArgs, TResult>
): UpdateDefinition<TArgs, TResult> | ((env: SatelliteEnv) => UpdateDefinition<TArgs, TResult>);
export function defineUpdate<TArgs, TResult>(
  update: Update<TArgs, TResult> | UpdateFn<TArgs, TResult>
): UpdateDefinition<TArgs, TResult> | ((env: SatelliteEnv) => UpdateDefinition<TArgs, TResult>) {
  if (typeof update === 'function') {
    return (env: SatelliteEnv) => {
      const result = {...update(env), type: __JUNO_FUNCTION_TYPE.UPDATE};
      UpdateSchema.parse(result);
      return result;
    };
  }

  const result = {...update, type: __JUNO_FUNCTION_TYPE.UPDATE};
  UpdateSchema.parse(result);
  return result;
}
