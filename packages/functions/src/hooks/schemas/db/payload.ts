import * as z from 'zod';
import {DocDescriptionSchema, DocSchema, RawDataSchema} from '../../../schemas/db';
import {VersionSchema} from '../../../schemas/satellite';

/**
 * @see DocUpsert
 */
export const DocUpsertSchema = z
  .object({
    /**
     * The previous version of the document before the update.
     * Undefined if this is a new document.
     */
    before: DocSchema.optional(),

    /**
     * The new version of the document after the update.
     */
    after: DocSchema
  })
  .strict();

/**
 * Represents a document update operation.
 *
 * This is used in hooks where a document is either being created or updated.
 */
export type DocUpsert = z.infer<typeof DocUpsertSchema>;

/**
 * @see ProposedDoc
 */
export const ProposedDocSchema = z
  .object({
    /**
     * The raw data of the document.
     */
    data: RawDataSchema,

    /**
     * An optional description of the document.
     */
    description: DocDescriptionSchema.optional(),

    /**
     * The expected version number to ensure consistency.
     */
    version: VersionSchema.optional()
  })
  .strict();

/**
 * Represents the proposed version of a document.
 * This can be validated before allowing the operation.
 */
export type ProposedDoc = z.infer<typeof ProposedDocSchema>;

/**
 * @see DocAssertSet
 */
export const DocAssertSetSchema = z
  .object({
    /**
     * The current version of the document before the operation.
     * Undefined if this is a new document.
     */
    current: DocSchema.optional(),

    /**
     * The proposed version of the document.
     * This can be validated before allowing the operation.
     */
    proposed: ProposedDocSchema
  })
  .strict();

/**
 * Represents a validation check before setting a document.
 *
 * The developer can compare the `current` and `proposed` versions and
 * throw an error if their validation fails.
 */
export type DocAssertSet = z.infer<typeof DocAssertSetSchema>;
