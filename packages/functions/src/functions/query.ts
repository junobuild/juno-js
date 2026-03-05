import * as z from 'zod';
import {type SatelliteEnv, SatelliteEnvSchema} from '../schemas/satellite.env';
import {createFunctionSchema} from '../utils/zod.utils';
import {
  type CustomFunctionWithArgs,
  type CustomFunctionWithArgsAndResult,
  type CustomFunctionWithoutArgsAndResult,
  type CustomFunctionWithResult,
  CUSTOM_FUNCTION_TYPE,
  CustomFunctionWithArgsAndResultSchema,
  CustomFunctionWithArgsSchema,
  CustomFunctionWithoutArgsAndResultSchema,
  CustomFunctionWithResultSchema
} from './schemas/function';

const QueryBaseSchema = z.strictObject({
  type: z.literal(CUSTOM_FUNCTION_TYPE.QUERY)
});

/**
 * @see Query
 */
export const QuerySchema = z.union([
  z.strictObject({
    ...CustomFunctionWithArgsAndResultSchema.shape,
    ...QueryBaseSchema.shape
  }),
  z.strictObject({
    ...CustomFunctionWithArgsSchema.shape,
    ...QueryBaseSchema.shape
  }),
  z.strictObject({
    ...CustomFunctionWithResultSchema.shape,
    ...QueryBaseSchema.shape
  }),
  z.strictObject({
    ...CustomFunctionWithoutArgsAndResultSchema.shape,
    ...QueryBaseSchema.shape
  })
]);

/**
 * The input shape for defining a query serverless function.
 * Does not include `type`, which is injected by `defineQuery`.
 */
export type Query<TArgs = unknown, TResult = unknown> =
  | Omit<CustomFunctionWithArgsAndResult<TArgs, TResult>, 'type'>
  | Omit<CustomFunctionWithArgs<TArgs>, 'type'>
  | Omit<CustomFunctionWithResult<TResult>, 'type'>
  | Omit<CustomFunctionWithoutArgsAndResult, 'type'>;

/**
 * A query function definition with `type` injected by `defineQuery`.
 * Queries are read-only functions that do not modify state.
 */
export type QueryDefinition<TArgs = unknown, TResult = unknown> = Query<TArgs, TResult> & {
  type: typeof CUSTOM_FUNCTION_TYPE.QUERY;
};

export const QueryFnSchema = <T extends z.ZodTypeAny>(querySchema: T) =>
  z.function({input: z.tuple([SatelliteEnvSchema]), output: querySchema});

/**
 * A factory function that receives the satellite environment and returns a query definition.
 */
export type QueryFn<TArgs, TResult> = (env: SatelliteEnv) => Query<TArgs, TResult>;

export const QueryFnOrObjectSchema = <T extends z.ZodTypeAny>(querySchema: T) =>
  z.union([querySchema, createFunctionSchema(QueryFnSchema(querySchema))]);

/**
 * A query definition or a factory function that returns one.
 */
export type QueryFnOrObject<TArgs, TResult> = Query<TArgs, TResult> | QueryFn<TArgs, TResult>;

export function defineQuery<TArgs, TResult>(
  query: Query<TArgs, TResult>
): QueryDefinition<TArgs, TResult>;
export function defineQuery<TArgs, TResult>(
  query: QueryFn<TArgs, TResult>
): (env: SatelliteEnv) => QueryDefinition<TArgs, TResult>;
export function defineQuery<TArgs, TResult>(
  query: QueryFnOrObject<TArgs, TResult>
): QueryDefinition<TArgs, TResult> | ((env: SatelliteEnv) => QueryDefinition<TArgs, TResult>);
export function defineQuery<TArgs, TResult>(
  query: Query<TArgs, TResult> | QueryFn<TArgs, TResult>
): QueryDefinition<TArgs, TResult> | ((env: SatelliteEnv) => QueryDefinition<TArgs, TResult>) {
  if (typeof query === 'function') {
    return (env: SatelliteEnv) => {
      const result = {...query(env), type: CUSTOM_FUNCTION_TYPE.QUERY};
      QuerySchema.parse(result);
      return result;
    };
  }

  const result = {...query, type: CUSTOM_FUNCTION_TYPE.QUERY};
  QuerySchema.parse(result);
  return result;
}
