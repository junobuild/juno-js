import {nonNullish} from '@junobuild/analytics/src/utils/dfinity/nullish.utils';
import * as z from 'zod/v4/index';
import {StrictPrincipalSchema} from './principal.utils';

/**
 * Ensures an unknown object is an identity.
 */
export const StrictIdentitySchema = z
  .unknown()
  .refine(
    (val) =>
      nonNullish(val) &&
      typeof val === 'object' &&
      'transformRequest' in val &&
      typeof val.transformRequest === 'function' &&
      'getPrincipal' in val &&
      typeof val.getPrincipal === 'function' &&
      StrictPrincipalSchema.safeParse(val.getPrincipal()).success,
    {
      message: 'Invalid Identity'
    }
  );
