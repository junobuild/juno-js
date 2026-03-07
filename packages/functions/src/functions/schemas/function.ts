import * as z from 'zod';
import {createFunctionSchema} from '../../utils/zod.utils';
import {JUNO_FUNCTION_TYPE} from '../constants';

/**
 * The type of a serverless function. Not exposed to the developer. It allows the CLI
 * to discover the functions when parsing the code.
 */
export type CustomFunctionType = (typeof JUNO_FUNCTION_TYPE)[keyof typeof JUNO_FUNCTION_TYPE];

const CustomFunctionBaseSchema = z.strictObject({
  type: z.enum([JUNO_FUNCTION_TYPE.QUERY, JUNO_FUNCTION_TYPE.UPDATE])
});

/**
 * @see CustomFunctionWithArgsAndResult
 */
export const CustomFunctionWithArgsAndResultSchema = z.strictObject({
  ...CustomFunctionBaseSchema.shape,
  args: z.instanceof(z.ZodType),
  result: z.instanceof(z.ZodType),
  handler: createFunctionSchema(
    z.function({
      input: z.tuple([z.unknown()]),
      output: z.union([z.unknown(), z.promise(z.unknown())])
    })
  )
});

/**
 * @see CustomFunctionWithArgs
 */
export const CustomFunctionWithArgsSchema = z.strictObject({
  ...CustomFunctionBaseSchema.shape,
  args: z.instanceof(z.ZodType),
  handler: createFunctionSchema(
    z.function({
      input: z.tuple([z.unknown()]),
      output: z.union([z.void(), z.promise(z.void())])
    })
  )
});

/**
 * @see CustomFunctionWithResult
 */
export const CustomFunctionWithResultSchema = z.strictObject({
  ...CustomFunctionBaseSchema.shape,
  result: z.instanceof(z.ZodType),
  handler: createFunctionSchema(
    z.function({
      input: z.tuple([]),
      output: z.union([z.unknown(), z.promise(z.unknown())])
    })
  )
});

/**
 * @see CustomFunctionWithoutArgsAndResult
 */
export const CustomFunctionWithoutArgsAndResultSchema = z.strictObject({
  ...CustomFunctionBaseSchema.shape,
  handler: createFunctionSchema(
    z.function({
      input: z.tuple([]),
      output: z.union([z.void(), z.promise(z.void())])
    })
  )
});

/**
 * @see CustomFunction
 */
export const CustomFunctionSchema = z.union([
  CustomFunctionWithArgsAndResultSchema,
  CustomFunctionWithArgsSchema,
  CustomFunctionWithResultSchema,
  CustomFunctionWithoutArgsAndResultSchema
]);

/**
 * Base interface for all serverless function variants.
 */
interface CustomFunctionBase {
  /**
   * The type of the function, either a query or an update.
   */
  type: CustomFunctionType;
}

/**
 * A serverless function with both input arguments and an output result.
 *
 * @template TArgs - The type of the input arguments.
 * @template TResult - The type of the output result.
 */
export interface CustomFunctionWithArgsAndResult<TArgs, TResult> extends CustomFunctionBase {
  /**
   * A Zod schema describing the input arguments.
   */
  args: z.ZodType<TArgs>;

  /**
   * A Zod schema describing the output result.
   */
  result: z.ZodType<TResult>;

  /**
   * The function handler. Can be synchronous or asynchronous.
   *
   * @param {TArgs} args - The input arguments.
   * @returns {TResult | Promise<TResult>}
   */
  handler: (args: TArgs) => TResult | Promise<TResult>;
}

/**
 * A serverless function with input arguments but no output result.
 *
 * @template TArgs - The type of the input arguments.
 */
export interface CustomFunctionWithArgs<TArgs> extends CustomFunctionBase {
  /**
   * A Zod schema describing the input arguments.
   */
  args: z.ZodType<TArgs>;

  /**
   * The function handler. Can be synchronous or asynchronous.
   *
   * @param {TArgs} args - The input arguments.
   * @returns {void | Promise<void>}
   */
  handler: (args: TArgs) => void | Promise<void>;
}

/**
 * A serverless function with an output result but no input arguments.
 *
 * @template TResult - The type of the output result.
 */
export interface CustomFunctionWithResult<TResult> extends CustomFunctionBase {
  /**
   * A Zod schema describing the output result.
   */
  result: z.ZodType<TResult>;

  /**
   * The function handler. Can be synchronous or asynchronous.
   *
   * @returns {TResult | Promise<TResult>}
   */
  handler: () => TResult | Promise<TResult>;
}

/**
 * A serverless function with no input arguments and no output result.
 */
export interface CustomFunctionWithoutArgsAndResult extends CustomFunctionBase {
  /**
   * The function handler. Can be synchronous or asynchronous.
   *
   * @returns {void | Promise<void>}
   */
  handler: () => void | Promise<void>;
}

/**
 * A serverless function definition. The four variants cover all combinations
 * of optional input arguments and output result.
 *
 * @template TArgs - The type of the input arguments.
 * @template TResult - The type of the output result.
 */
export type CustomFunction<TArgs = unknown, TResult = unknown> =
  | CustomFunctionWithArgsAndResult<TArgs, TResult>
  | CustomFunctionWithArgs<TArgs>
  | CustomFunctionWithResult<TResult>
  | CustomFunctionWithoutArgsAndResult;
