import {PrincipalSchema, Uint8ArraySchema} from '@dfinity/zod-schemas';
import * as z from 'zod';

export const JunoType = {
  /** Validates a Principal. */
  principal: () => PrincipalSchema,
  /** Validates a Uint8Array (blob, vec<u8>). */
  uint8Array: () => Uint8ArraySchema
};

// z.union is omitted because object unions can't be reliably serialized to Candid/Rust without a discriminator field.
const {union: _, ...rest} = z;

/**
 * Juno's type system - an extended Zod instance for Serverless Functions.
 *
 * The schema builder exposes all Zod schemas and functions aside from
 * `union()` which can't be reliably serialized currently without a discriminator field.
 * That's why you should prefer using `discriminatedUnion()` instead.
 *
 * It extends Zod with various schemas useful for writing your custom functions
 * such as `j.principal()` and `j.uint8Array()`.
 *
 * @example
 * import { j } from '@junobuild/functions';
 *
 * const MySchema = j.strictObject({
 *   id: j.principal(),
 *   name: j.string(),
 * });
 */
const j = Object.assign({}, rest) as unknown as Omit<typeof z, 'union'> & typeof JunoType;

j.principal = JunoType.principal;
j.uint8Array = JunoType.uint8Array;

export {j};
