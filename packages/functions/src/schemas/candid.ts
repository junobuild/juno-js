import {
  PrincipalSchema as DfnPrincipalSchema,
  Uint8ArraySchema as DfnUint8ArraySchema
} from '@dfinity/zod-schemas';
import type * as z from 'zod';

/**
 * A schema that validates a value is an Uint8Array.
 */
export const Uint8ArraySchema = DfnUint8ArraySchema;

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
export const PrincipalSchema = DfnPrincipalSchema;

/**
 * Represents a principal - i.e. an object instantiated with the class Principal.
 */
export type Principal = z.infer<typeof PrincipalSchema>;
