import * as z from 'zod';

/**
 * @see RawPrincipal
 */
export const RawPrincipalSchema = z.custom<Uint8Array>((val) => val instanceof Uint8Array, {
  message: 'Expected Uint8Array'
});

/**
 * Represents a raw principal identifier.
 *
 * Principals are unique identities used in authentication and authorization.
 */
export type RawPrincipal = z.infer<typeof RawPrincipalSchema>;
