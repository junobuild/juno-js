import {j} from '@junobuild/schema';

/**
 * @see RawPrincipal
 */
export const RawPrincipalSchema = j.uint8Array();

/**
 * Represents a raw principal - a Uint8Array representation of a Principal.
 */
export type RawPrincipal = Uint8Array;
