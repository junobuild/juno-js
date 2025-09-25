import * as z from 'zod';

/**
 * Wraps a Zod function schema so that parsing returns the **original function**
 * instead of Zod's wrapped validator.
 *
 * Why?
 * ----
 * In Zod v4, `z.function({...})` normally returns a wrapper that validates
 * both arguments and the return value **every time the function is called**.
 * If your function's return type is `void | Promise<void>`, Zod tries to
 * validate it synchronously, which can throw
 *   "Encountered Promise during synchronous parse"
 * when the implementation is async.
 *
 * By using `.implement`, we tell Zod: “this is the function that satisfies
 * the schema.” That way the schema still validates the function shape at
 * parse time, but the returned value is the **original function** you passed
 * in — no runtime wrapper, no sync/async mismatch.
 *
 * Reference:
 * https://github.com/colinhacks/zod/issues/4143#issuecomment-2845134912*
 */
// TODO: Duplicates the helper in @junobuild/functions.
export const createFunctionSchema = <T extends z.ZodFunction>(schema: T) =>
  z.custom<Parameters<T['implement']>[0]>((fn) =>
    schema.implement(fn as Parameters<T['implement']>[0])
  );
