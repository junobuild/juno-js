import * as z from 'zod';
import {createFunctionSchema} from '../../utils/zod.utils';
import {JUNO_FUNCTION_TYPE} from '../constants';

/**
 * The type of a serverless function. Not exposed to the developer. It allows the CLI
 * to discover the functions when parsing the code.
 */
export type CustomFunctionType = (typeof JUNO_FUNCTION_TYPE)[keyof typeof JUNO_FUNCTION_TYPE];

const CustomFunctionTypeSchema = z.strictObject({
  type: z.enum([JUNO_FUNCTION_TYPE.QUERY, JUNO_FUNCTION_TYPE.UPDATE])
});

export const CustomFunctionGuardSchema = createFunctionSchema(
  z.function({
    output: z.void()
  })
);

/**
 * @see CustomFunctionBase
 */
const CustomFunctionBaseSchema = z.strictObject({
  guard: CustomFunctionGuardSchema.optional()
});

/**
 * @see CustomFunctionWithArgsAndResult
 */
export const CustomFunctionWithArgsAndResultSchema = z.strictObject({
  ...CustomFunctionTypeSchema.shape,
  ...CustomFunctionBaseSchema.shape,
  args: z.instanceof(z.ZodObject),
  result: z.instanceof(z.ZodObject),
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
  ...CustomFunctionTypeSchema.shape,
  ...CustomFunctionBaseSchema.shape,
  args: z.instanceof(z.ZodObject),
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
  ...CustomFunctionTypeSchema.shape,
  ...CustomFunctionBaseSchema.shape,
  result: z.instanceof(z.ZodObject),
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
  ...CustomFunctionTypeSchema.shape,
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

  /**
   * An optional function that runs before the function is executed.
   * If the guard throws, the function is not executed.
   */
  guard?: () => void;
}

/**
 * A serverless function with both input arguments and an output result.
 *
 * @template TArgs - The type of the input arguments.
 * @template TResult - The type of the output result.
 */
export interface CustomFunctionWithArgsAndResult<
  TArgs extends z.ZodRawShape,
  TResult extends z.ZodRawShape
> extends CustomFunctionBase {
  /**
   * A Zod schema describing the input arguments.
   */
  args: z.ZodObject<TArgs>;

  /**
   * A Zod schema describing the output result.
   */
  result: z.ZodObject<TResult>;

  /**
   * The function handler. Can be synchronous or asynchronous.
   *
   * @param {TArgs} args - The input arguments.
   * @returns {TResult | Promise<TResult>}
   */
  handler: (
    args: z.infer<z.ZodObject<TArgs>>
  ) => z.infer<z.ZodObject<TResult>> | Promise<z.infer<z.ZodObject<TResult>>>;
}

/**
 * A serverless function with input arguments but no output result.
 *
 * @template TArgs - The type of the input arguments.
 */
export interface CustomFunctionWithArgs<TArgs extends z.ZodRawShape> extends CustomFunctionBase {
  /**
   * A Zod schema describing the input arguments.
   */
  args: z.ZodObject<TArgs>;

  /**
   * The function handler. Can be synchronous or asynchronous.
   *
   * @param {TArgs} args - The input arguments.
   * @returns {void | Promise<void>}
   */
  handler: (args: z.infer<z.ZodObject<TArgs>>) => void | Promise<void>;
}

/**
 * A serverless function with an output result but no input arguments.
 *
 * @template TResult - The type of the output result.
 */
export interface CustomFunctionWithResult<
  TResult extends z.ZodRawShape
> extends CustomFunctionBase {
  /**
   * A Zod schema describing the output result.
   */
  result: z.ZodObject<TResult>;

  /**
   * The function handler. Can be synchronous or asynchronous.
   *
   * @returns {TResult | Promise<TResult>}
   */
  handler: () => z.infer<z.ZodObject<TResult>> | Promise<z.infer<z.ZodObject<TResult>>>;
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
export type CustomFunction<
  TArgs extends z.ZodRawShape = z.ZodRawShape,
  TResult extends z.ZodRawShape = z.ZodRawShape
> =
  | CustomFunctionWithArgsAndResult<TArgs, TResult>
  | CustomFunctionWithArgs<TArgs>
  | CustomFunctionWithResult<TResult>
  | CustomFunctionWithoutArgsAndResult;
