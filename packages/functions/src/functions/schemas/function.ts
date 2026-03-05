import * as z from 'zod';
import {createFunctionSchema} from '../../utils/zod.utils';

export const CUSTOM_FUNCTION_TYPE = {
  QUERY: '__juno_function_query',
  UPDATE: '__juno_function_update'
} as const;

/**
 * The type of a serverless function. Not exposed to the developer. It allows the CLI
 * to discover the functions when parsing the code.
 */
export type CustomFunctionType = (typeof CUSTOM_FUNCTION_TYPE)[keyof typeof CUSTOM_FUNCTION_TYPE];

/**
 * @see CustomFunction
 */
export const CustomFunctionSchema = z.strictObject({
  type: z.enum([CUSTOM_FUNCTION_TYPE.QUERY, CUSTOM_FUNCTION_TYPE.UPDATE]),
  args: z.instanceof(z.ZodType).optional(),
  result: z.instanceof(z.ZodType).optional(),
  handler: createFunctionSchema(
    z.function({
      input: z.tuple([z.unknown().optional()]),
      output: z.union([z.unknown(), z.promise(z.unknown()), z.void(), z.promise(z.void())])
    })
  )
});

/**
 * Defines a serverless function with optional input arguments and output result.
 *
 * @template TArgs - The type of the input arguments.
 * @template TResult - The type of the output result.
 */
export interface CustomFunction<TArgs = unknown, TResult = unknown> {
  /**
   * The type of the function, either a query or an update.
   */
  type: CustomFunctionType;

  /**
   * An optional Zod schema describing the input arguments.
   * If not provided, the function takes no arguments.
   */
  args?: z.ZodType<TArgs>;

  /**
   * An optional Zod schema describing the output result.
   * If not provided, the function returns void.
   */
  result?: z.ZodType<TResult>;

  /**
   * The function handler. Can be synchronous or asynchronous.
   *
   * @param {TArgs} args - The input arguments, if any.
   * @returns {TResult | Promise<TResult> | void | Promise<void>}
   */
  handler: (args: TArgs) => TResult | Promise<TResult> | void | Promise<void>;
}
