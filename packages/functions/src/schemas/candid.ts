import {Principal as CandidPrincipal} from '@dfinity/principal';
import * as z from 'zod';

/**
 * @see RawPrincipal
 */
export const RawPrincipalSchema = z.custom<Uint8Array>((val) => val instanceof Uint8Array, {
  message: 'Expected a Uint8Array representation of a Principal'
});

/**
 * Represents a raw principal - a Uint8Array representation of a Principal.
 */
export type RawPrincipal = z.infer<typeof RawPrincipalSchema>;

/**
 * @see Principal
 */
export const PrincipalSchema = z.custom<CandidPrincipal>((val) => val instanceof CandidPrincipal, {
  message: 'Expected an instance of a Principal'
});

/**
 * Represents a principal - i.e. an object instantiated with the class Principal.
 */
export type Principal = z.infer<typeof PrincipalSchema>;

/**
 * A schema that validates a value is an Uint8Array.
 */
export const Uint8ArraySchema = z.custom<Uint8Array>((val) => val instanceof Uint8Array, {
  message: 'Expected Uint8Array'
});
