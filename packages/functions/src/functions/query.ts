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

const QueryBaseSchema = z.strictObject({
  type: z.literal(JUNO_FUNCTION_TYPE.QUERY)
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
export type Query<
  TArgs extends z.ZodRawShape = z.ZodRawShape,
  TResult extends z.ZodRawShape = z.ZodRawShape
> =
  | Omit<CustomFunctionWithArgsAndResult<TArgs, TResult>, 'type'>
  | Omit<CustomFunctionWithArgs<TArgs>, 'type'>
  | Omit<CustomFunctionWithResult<TResult>, 'type'>
  | Omit<CustomFunctionWithoutArgsAndResult, 'type'>;

/**
 * A query function definition with `type` injected by `defineQuery`.
 * Queries are read-only functions that do not modify state.
 */
export type QueryDefinition<
  TArgs extends z.ZodRawShape = z.ZodRawShape,
  TResult extends z.ZodRawShape = z.ZodRawShape
> = Query<TArgs, TResult> & {
  type: typeof JUNO_FUNCTION_TYPE.QUERY;
};

export const QueryFnSchema = <T extends z.ZodTypeAny>(querySchema: T) =>
  z.function({input: z.tuple([SatelliteEnvSchema]), output: querySchema});

/**
 * A factory function that receives the satellite environment and returns a query definition.
 */
export type QueryFn<TArgs extends z.ZodRawShape, TResult extends z.ZodRawShape> = (
  env: SatelliteEnv
) => Query<TArgs, TResult>;

export const QueryFnOrObjectSchema = <T extends z.ZodTypeAny>(querySchema: T) =>
  z.union([querySchema, createFunctionSchema(QueryFnSchema(querySchema))]);

/**
 * A query definition or a factory function that returns one.
 */
export type QueryFnOrObject<TArgs extends z.ZodRawShape, TResult extends z.ZodRawShape> =
  | Query<TArgs, TResult>
  | QueryFn<TArgs, TResult>;

export function defineQuery<TArgs extends z.ZodRawShape, TResult extends z.ZodRawShape>(
  query: Query<TArgs, TResult>
): QueryDefinition<TArgs, TResult>;
export function defineQuery<TArgs extends z.ZodRawShape, TResult extends z.ZodRawShape>(
  query: QueryFn<TArgs, TResult>
): (env: SatelliteEnv) => QueryDefinition<TArgs, TResult>;
export function defineQuery<TArgs extends z.ZodRawShape, TResult extends z.ZodRawShape>(
  query: QueryFnOrObject<TArgs, TResult>
): QueryDefinition<TArgs, TResult> | ((env: SatelliteEnv) => QueryDefinition<TArgs, TResult>);
export function defineQuery<TArgs extends z.ZodRawShape, TResult extends z.ZodRawShape>(
  query: Query<TArgs, TResult> | QueryFn<TArgs, TResult>
): QueryDefinition<TArgs, TResult> | ((env: SatelliteEnv) => QueryDefinition<TArgs, TResult>) {
  if (typeof query === 'function') {
    return (env: SatelliteEnv) => {
      const result = {...query(env), type: JUNO_FUNCTION_TYPE.QUERY};
      QuerySchema.parse(result);
      return result;
    };
  }

  const result = {...query, type: JUNO_FUNCTION_TYPE.QUERY};
  QuerySchema.parse(result);
  return result;
}
