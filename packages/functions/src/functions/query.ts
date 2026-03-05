import * as z from 'zod';
import {type SatelliteEnv, SatelliteEnvSchema} from '../schemas/satellite.env';
import {createFunctionSchema} from '../utils/zod.utils';
import {CUSTOM_FUNCTION_TYPE, type CustomFunction, CustomFunctionSchema} from './schemas/function';

/**
 * @see Query
 */
export const QuerySchema = z.strictObject({
  ...CustomFunctionSchema.shape,
  type: z.literal(CUSTOM_FUNCTION_TYPE.QUERY)
});

/**
 * The input shape for defining a query serverless function.
 * Does not include `type`, which is injected by `defineQuery`.
 */
export type Query = Omit<CustomFunction, 'type'>;

/**
 * A query function definition with `type` injected by `defineQuery`.
 * Queries are read-only functions that do not modify state.
 */
export type QueryDefinition = Query & {type: typeof CUSTOM_FUNCTION_TYPE.QUERY};

export const QueryFnSchema = <T extends z.ZodTypeAny>(querySchema: T) =>
  z.function({input: z.tuple([SatelliteEnvSchema]), output: querySchema});

/**
 * A factory function that receives the satellite environment and returns a query definition.
 */
export type QueryFn<T extends Query> = (env: SatelliteEnv) => T;

export const QueryFnOrObjectSchema = <T extends z.ZodTypeAny>(querySchema: T) =>
  z.union([querySchema, createFunctionSchema(QueryFnSchema(querySchema))]);

/**
 * A query definition or a factory function that returns one.
 */
export type QueryFnOrObject<T extends Query> = T | QueryFn<T>;

export function defineQuery<T extends Query>(query: T): T & QueryDefinition;
export function defineQuery<T extends Query>(query: QueryFn<T>): QueryFn<T & QueryDefinition>;
export function defineQuery<T extends Query>(
  query: QueryFnOrObject<T>
): QueryFnOrObject<T & QueryDefinition>;
export function defineQuery<T extends Query>(
  query: QueryFnOrObject<T>
): QueryFnOrObject<T & QueryDefinition> {
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
