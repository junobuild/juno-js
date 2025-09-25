import * as z from 'zod';

// TODO: Workaround source: https://github.com/colinhacks/zod/issues/4143#issuecomment-2845134912
export const createFunctionSchema = <T extends z.core.$ZodFunction>(schema: T) =>
  z.custom<Parameters<T['implement']>[0]>((fn) =>
    schema.implement(fn as Parameters<T['implement']>[0])
  );
