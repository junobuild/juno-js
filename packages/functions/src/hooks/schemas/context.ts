import * as z from 'zod';
import {RawUserIdSchema} from '../../schemas/core';

/**
 * @see HookContext
 */
export const HookContextSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z
    .object({
      /**
       * The user who originally triggered the function that in turn triggered the hook.
       */
      caller: RawUserIdSchema,

      /**
       * The data associated with the hook execution.
       */
      data: dataSchema
    })
    .strict();

/**
 * Represents the context provided to hooks, containing information about the caller and related data.
 *
 * @template T - The type of data associated with the hook.
 */
export type HookContext<T extends z.ZodTypeAny> = z.infer<ReturnType<typeof HookContextSchema<T>>>;
