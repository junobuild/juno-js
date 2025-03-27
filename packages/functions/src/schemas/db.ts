import * as z from 'zod';
import {Uint8ArraySchema} from './candid';
import {
  type RawUserId,
  RawUserIdSchema,
  type Timestamp,
  TimestampSchema,
  type Version,
  VersionSchema
} from './satellite';

/**
 * @see DocDescription
 */
export const DocDescriptionSchema = z.string().max(1024);

/**
 * Represents a document description with a maximum length of 1024 characters.
 */
export type DocDescription = z.infer<typeof DocDescriptionSchema>;

/**
 * @see RawData
 */
export const RawDataSchema = Uint8ArraySchema;

/**
 * Represents raw binary data.
 *
 * This is used to store structured data in a document.
 */
export type RawData = z.infer<typeof Uint8ArraySchema>;

/**
 * @see Doc
 */
export const DocSchema = z
  .object({
    owner: RawUserIdSchema,
    data: RawDataSchema,
    description: DocDescriptionSchema.optional(),
    created_at: TimestampSchema,
    updated_at: TimestampSchema,
    version: VersionSchema.optional()
  })
  .strict();

/**
 * Represents a document stored in a collection.
 */
export interface Doc {
  /**
   * The user who owns this document.
   */
  owner: RawUserId;

  /**
   * The raw data of the document.
   */
  data: RawData;

  /**
   * An optional description of the document.
   */
  description?: DocDescription;

  /**
   * The timestamp when the document was first created.
   */
  created_at: Timestamp;

  /**
   * The timestamp when the document was last updated.
   */
  updated_at: Timestamp;

  /**
   * The version number of the document, used for consistency checks.
   * If not provided, it's assumed to be the first version.
   */
  version?: Version;
}

/**
 * @see SetDoc
 */
export const SetDocSchema = z
  .object({
    data: RawDataSchema,
    description: DocDescriptionSchema.optional(),
    version: VersionSchema.optional()
  })
  .strict();

/**
 * Represents the proposed version of a document to be created or updated.
 * This can be validated before allowing the operation.
 */
export interface SetDoc {
  /**
   * The raw data of the document.
   */
  data: RawData;

  /**
   * An optional description of the document.
   */
  description?: DocDescription;

  /**
   * The expected version number to ensure consistency.
   */
  version?: Version;
}

/**
 * @see DelDoc
 */
export const DelDocSchema = z
  .object({
    version: VersionSchema.optional()
  })
  .strict();

/**
 * Represents the proposed version of a document to be deleted.
 * This can be validated before allowing the operation.
 */
export interface DelDoc {
  /**
   * The expected version number to ensure consistency.
   */
  version?: Version;
}
