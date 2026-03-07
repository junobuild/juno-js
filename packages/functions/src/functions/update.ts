import * as z from 'zod';
import {type SatelliteEnv, SatelliteEnvSchema} from '../schemas/satellite.env';
import {createFunctionSchema} from '../utils/zod.utils';
import {JUNO_FUNCTION_TYPE} from './constants';
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
  type: z.literal(JUNO_FUNCTION_TYPE.UPDATE)
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
 * The input shape for defining an update serverless function.
 * Does not include `type`, which is injected by `defineUpdate`.
 */
export type Update<
  TArgs extends z.ZodRawShape = z.ZodRawShape,
  TResult extends z.ZodRawShape = z.ZodRawShape
> =
  | Omit<CustomFunctionWithArgsAndResult<TArgs, TResult>, 'type'>
  | Omit<CustomFunctionWithArgs<TArgs>, 'type'>
  | Omit<CustomFunctionWithResult<TResult>, 'type'>
  | Omit<CustomFunctionWithoutArgsAndResult, 'type'>;

/**
 * A update function definition with `type` injected by `defineUpdate`.
 * Queries are read-only functions that do not modify state.
 */
export type UpdateDefinition<
  TArgs extends z.ZodRawShape = z.ZodRawShape,
  TResult extends z.ZodRawShape = z.ZodRawShape
> = Update<TArgs, TResult> & {
  type: typeof JUNO_FUNCTION_TYPE.UPDATE;
};

export const UpdateFnSchema = <T extends z.ZodTypeAny>(updateSchema: T) =>
  z.function({input: z.tuple([SatelliteEnvSchema]), output: updateSchema});

/**
 * A factory function that receives the satellite environment and returns an update definition.
 */
export type UpdateFn<TArgs extends z.ZodRawShape, TResult extends z.ZodRawShape> = (
  env: SatelliteEnv
) => Update<TArgs, TResult>;

export const UpdateFnOrObjectSchema = <T extends z.ZodTypeAny>(updateSchema: T) =>
  z.union([updateSchema, createFunctionSchema(UpdateFnSchema(updateSchema))]);

/**
 * A update definition or a factory function that returns one.
 */
export type UpdateFnOrObject<TArgs extends z.ZodRawShape, TResult extends z.ZodRawShape> =
  | Update<TArgs, TResult>
  | UpdateFn<TArgs, TResult>;

export function defineUpdate<TArgs extends z.ZodRawShape, TResult extends z.ZodRawShape>(
  update: Update<TArgs, TResult>
): UpdateDefinition<TArgs, TResult>;
export function defineUpdate<TArgs extends z.ZodRawShape, TResult extends z.ZodRawShape>(
  update: UpdateFn<TArgs, TResult>
): (env: SatelliteEnv) => UpdateDefinition<TArgs, TResult>;
export function defineUpdate<TArgs extends z.ZodRawShape, TResult extends z.ZodRawShape>(
  update: UpdateFnOrObject<TArgs, TResult>
): UpdateDefinition<TArgs, TResult> | ((env: SatelliteEnv) => UpdateDefinition<TArgs, TResult>);
export function defineUpdate<TArgs extends z.ZodRawShape, TResult extends z.ZodRawShape>(
  update: Update<TArgs, TResult> | UpdateFn<TArgs, TResult>
): UpdateDefinition<TArgs, TResult> | ((env: SatelliteEnv) => UpdateDefinition<TArgs, TResult>) {
  if (typeof update === 'function') {
    return (env: SatelliteEnv) => {
      const result = {...update(env), type: JUNO_FUNCTION_TYPE.UPDATE};
      UpdateSchema.parse(result);
      return result;
    };
  }

  const result = {...update, type: JUNO_FUNCTION_TYPE.UPDATE};
  UpdateSchema.parse(result);
  return result;
}
