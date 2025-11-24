import * as z from 'zod';
import {PrincipalSchema} from '../schemas/candid';

/**
 * @see CanisterOptions
 */
export const CanisterOptionsSchema = z.strictObject({
  canisterId: PrincipalSchema.optional()
});

/**
 * The options to initialize a canister.
 */
export type CanisterOptions = z.infer<typeof CanisterOptionsSchema>;
