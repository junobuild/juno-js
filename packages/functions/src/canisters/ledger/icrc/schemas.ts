import type * as z from 'zod';
import {CanisterOptionsSchema} from '../../_schemas';

/**
 * @see CanisterOptions
 */
export const IcrcCanisterOptionsSchema = CanisterOptionsSchema.required();

/**
 * The options to initialize an Icrc canister.
 */
export type IcrcCanisterOptions = z.infer<typeof IcrcCanisterOptionsSchema>;
