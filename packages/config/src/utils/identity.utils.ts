import * as z from 'zod/v4/index';
import {StrictPrincipalSchema} from './principal.utils';

/**
 * Ensures an unknown object is an identity.
 */
export const StrictIdentitySchema = z
  .unknown()
  .refine(
    (val) =>
      val !== undefined &&
      val !== null &&
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
