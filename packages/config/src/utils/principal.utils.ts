import {PrincipalTextSchema} from '@dfinity/zod-schemas';
import * as z from 'zod';

/**
 * Ensures reliable validation of PrincipalTextSchema inside z.record.
 */
export const StrictPrincipalTextSchema = z
  .string()
  .refine((val) => PrincipalTextSchema.safeParse(val).success, {
    message: 'Invalid textual representation of a Principal.'
  });
