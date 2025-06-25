import { z } from 'zod/v4';
import {Uint8ArraySchema} from './candid';
import {
  type Description,
  DescriptionSchema,
  type RawUserId,
  RawUserIdSchema,
  type Timestamp,
  TimestampSchema,
  type Version,
  VersionSchema
} from './satellite';

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
    description: DescriptionSchema.optional(),
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
  description?: Description;

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
 * @see OptionDoc
 */
export const OptionDocSchema = DocSchema.optional();

/**
 * A shorthand for a document that might or not be defined.
 */
export type OptionDoc = Doc | undefined;

/**
 * @see SetDoc
 */
export const SetDocSchema = z
  .object({
    data: RawDataSchema,
    description: DescriptionSchema.optional(),
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
  description?: Description;

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
