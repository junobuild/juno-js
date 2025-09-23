import {Principal} from '@dfinity/principal';
import {PrincipalTextSchema} from '@dfinity/zod-schemas';
import * as z from 'zod/v4';

/**
 * Ensures reliable validation of PrincipalTextSchema inside z.record.
 */
export const StrictPrincipalTextSchema = z
  .string()
  .refine((val) => PrincipalTextSchema.safeParse(val).success, {
    message: 'Invalid textual representation of a Principal.'
  });

/**
 * Ensures an unknown type is a Principal.
 */
export const StrictPrincipalSchema = z.unknown().transform((val, ctx): Principal => {
  if (Principal.isPrincipal(val)) {
    return Principal.from(val);
  }

  ctx.issues.push({
    code: 'custom',
    message: 'Invalid Principal',
    input: val
  });

  return z.NEVER;
});
