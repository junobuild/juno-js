import * as z from 'zod';
import {JunoSchemaId} from './schema-id';

/**
 * Zod schema for an arbitrary precision natural number.
 * Maps to `u128` in Rust.
 *
 * @example
 * ```typescript
 * const schema = j.object({
 *   status: j.nat()
 * });
 * ```
 */
export const NatSchema = z.bigint().meta({id: JunoSchemaId.Nat});
