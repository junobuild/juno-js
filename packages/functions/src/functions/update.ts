import * as z from 'zod';
import {type SatelliteEnv, SatelliteEnvSchema} from '../hooks/schemas/satellite.env';
import {createFunctionSchema} from '../utils/zod.utils';
import {CUSTOM_FUNCTION_TYPE, type CustomFunction, CustomFunctionSchema} from './schemas/function';

/**
 * @see Update
 */
export const UpdateSchema = z.strictObject({
  ...CustomFunctionSchema.shape,
  type: z.literal(CUSTOM_FUNCTION_TYPE.UPDATE)
});

/**
 * The input shape for defining a update serverless function.
 * Does not include `type`, which is injected by `defineUpdate`.
 */
export type Update = Omit<CustomFunction, 'type'>;

/**
 * A update function definition with `type` injected by `defineUpdate`.
 * Queries are read-only functions that do not modify state.
 */
export type UpdateDefinition = Update & {type: typeof CUSTOM_FUNCTION_TYPE.UPDATE};

export const UpdateFnSchema = <T extends z.ZodTypeAny>(updateSchema: T) =>
  z.function({input: z.tuple([SatelliteEnvSchema]), output: updateSchema});

/**
 * A factory function that receives the satellite environment and returns a update definition.
 */
export type UpdateFn<T extends Update> = (env: SatelliteEnv) => T;

export const UpdateFnOrObjectSchema = <T extends z.ZodTypeAny>(updateSchema: T) =>
  z.union([updateSchema, createFunctionSchema(UpdateFnSchema(updateSchema))]);

/**
 * A update definition or a factory function that returns one.
 */
export type UpdateFnOrObject<T extends Update> = T | UpdateFn<T>;

export function defineUpdate<T extends Update>(update: T): T & UpdateDefinition;
export function defineUpdate<T extends Update>(update: UpdateFn<T>): UpdateFn<T & UpdateDefinition>;
export function defineUpdate<T extends Update>(
  update: UpdateFnOrObject<T>
): UpdateFnOrObject<T & UpdateDefinition>;
export function defineUpdate<T extends Update>(
  update: UpdateFnOrObject<T>
): UpdateFnOrObject<T & UpdateDefinition> {
  if (typeof update === 'function') {
    return (env: SatelliteEnv) => {
      const result = {...update(env), type: CUSTOM_FUNCTION_TYPE.UPDATE};
      UpdateSchema.parse(result);
      return result;
    };
  }

  const result = {...update, type: CUSTOM_FUNCTION_TYPE.UPDATE};
  UpdateSchema.parse(result);
  return result;
}
