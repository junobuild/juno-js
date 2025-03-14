import * as z from 'zod';

/**
 * @see Timestamp
 */
export const TimestampSchema = z.bigint();

/**
 * Represents a timestamp in nanoseconds since the Unix epoch.
 *
 * Used for tracking when events occur, such as document creation and updates.
 */
export type Timestamp = z.infer<typeof TimestampSchema>;

/**
 * @see Version
 */
export const VersionSchema = z.bigint();

/**
 * Represents a version number for tracking changes.
 *
 * This is typically incremented with each update to ensure consistency.
 */
export type Version = z.infer<typeof VersionSchema>;

/**
 * @see RawData
 */
export const RawDataSchema = z.custom<Uint8Array>((val) => val instanceof Uint8Array, {
  message: 'Expected Uint8Array'
});

/**
 * Represents raw binary data.
 *
 * This is used to store unstructured data in a document.
 */
export type RawData = z.infer<typeof RawDataSchema>;

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

/**
 * @see RawUserId
 */
export const RawUserIdSchema = RawPrincipalSchema;

/**
 * Represents a raw user identifier.
 *
 * This is a principal associated with a user.
 */
export type RawUserId = z.infer<typeof RawUserIdSchema>;
