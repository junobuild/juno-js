import * as z from 'zod';
import {PrincipalSchema, RawPrincipalSchema} from './candid';

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
 * @see RawUserId
 */
export const RawUserIdSchema = RawPrincipalSchema;

/**
 * Represents a raw user identifier.
 *
 * This is a principal associated with a user.
 */
export type RawUserId = z.infer<typeof RawUserIdSchema>;

/**
 * @see UserId
 */
export const UserIdSchema = PrincipalSchema;

/**
 * Represents a user identifier.
 *
 * This is a principal associated with a user.
 */
export type UserId = z.infer<typeof UserIdSchema>;

/**
 * @see Collection
 */
export const CollectionSchema = z.string();

/**
 * A collection name where data are stored.
 */
export type Collection = z.infer<typeof CollectionSchema>;

/**
 * @see Key
 */
export const KeySchema = z.string();

/**
 * A unique key identifier within a collection.
 */
export type Key = z.infer<typeof KeySchema>;

/**
 * @see Description
 */
export const DescriptionSchema = z.string().max(1024);

/**
 * Represents a description with a maximum length of 1024 characters.
 * Used for document and asset fields which can be useful for search purpose.
 */
export type Description = z.infer<typeof DescriptionSchema>;
