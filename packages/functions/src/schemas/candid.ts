import {PrincipalSchema as CandidPrincipalSchema} from '@dfinity/zod-schemas';
import * as z from 'zod';

/**
 * A schema that validates a value is an Uint8Array.
 */
export const Uint8ArraySchema = z.custom<Uint8Array>((val) => val instanceof Uint8Array, {
  message: 'Expected Uint8Array'
});

/**
 * @see RawPrincipal
 */
export const RawPrincipalSchema = Uint8ArraySchema;

/**
 * Represents a raw principal - a Uint8Array representation of a Principal.
 */
export type RawPrincipal = z.infer<typeof RawPrincipalSchema>;

/**
 * @see Principal
 */
export const PrincipalSchema = CandidPrincipalSchema;

/**
 * Represents a principal - i.e. an object instantiated with the class Principal.
 */
export type Principal = z.infer<typeof PrincipalSchema>;
