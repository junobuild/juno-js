import {j} from '@junobuild/schema';
import * as z from 'zod';

/**
 * @see CanisterOptions
 */
export const CanisterOptionsSchema = z.strictObject({
  canisterId: j.principal().optional()
});

/**
 * The options to initialize a canister.
 */
export type CanisterOptions = z.infer<typeof CanisterOptionsSchema>;
