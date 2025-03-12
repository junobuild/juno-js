/**
 * Represents a timestamp in nanoseconds since the Unix epoch.
 *
 * Used for tracking when events occur, such as document creation and updates.
 */
export type Timestamp = bigint;

/**
 * Represents a version number for tracking changes.
 *
 * This is typically incremented with each update to ensure consistency.
 */
export type Version = bigint;

/**
 * Represents raw binary data.
 *
 * This is used to store unstructured data in a document.
 */
export type RawData = Uint8Array;

/**
 * Represents a raw principal identifier.
 *
 * Principals are unique identities used in authentication and authorization.
 */
export type RawPrincipal = Uint8Array;

/**
 * Represents a raw user identifier.
 *
 * This is a principal associated with a user.
 */
export type RawUserId = RawPrincipal;
