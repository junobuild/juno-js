import * as z from 'zod';
import {Uint8ArraySchema} from './candid';
import {RawUserIdSchema, TimestampSchema, VersionSchema} from './satellite';

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
    /**
     * The user who owns this document.
     */
    owner: RawUserIdSchema,

    /**
     * The raw data of the document.
     */
    data: RawDataSchema,

    /**
     * An optional description of the document.
     */
    description: DocDescriptionSchema.optional(),

    /**
     * The timestamp when the document was first created.
     */
    created_at: TimestampSchema,

    /**
     * The timestamp when the document was last updated.
     */
    updated_at: TimestampSchema,

    /**
     * The version number of the document, used for consistency checks.
     * If not provided, it's assumed to be the first version.
     */
    version: VersionSchema.optional()
  })
  .strict();

/**
 * Represents a document stored in a collection.
 */
export type Doc = z.infer<typeof DocSchema>;
