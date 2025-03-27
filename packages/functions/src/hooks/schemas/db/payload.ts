import * as z from 'zod';
import {
  Doc,
  DocDescription,
  DocDescriptionSchema,
  DocSchema,
  RawData,
  RawDataSchema
} from '../../../schemas/db';
import {Version, VersionSchema} from '../../../schemas/satellite';

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
export interface DocUpsert {
  before?: Doc;
  after: Doc;
}

/**
 * @see SetDoc
 */
export const SetDocSchema = z
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
 * Represents the proposed version of a document to be created or updated.
 * This can be validated before allowing the operation.
 */
export interface SetDoc {
  data: RawData;
  description?: DocDescription;
  version?: Version;
}

/**
 * @see DelDoc
 */
export const DelDocSchema = z
  .object({
    /**
     * The expected version number to ensure consistency.
     */
    version: VersionSchema.optional()
  })
  .strict();

/**
 * Represents the proposed version of a document to be deleted.
 * This can be validated before allowing the operation.
 */
export interface DelDoc {
  version?: Version;
}

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
    proposed: SetDocSchema
  })
  .strict();

/**
 * Represents a validation check before setting a document.
 *
 * The developer can compare the `current` and `proposed` versions and
 * throw an error if their validation fails.
 */
export interface DocAssertSet {
  current?: Doc;
  proposed: SetDoc;
}

/**
 * @see DocAssertDelete
 */
export const DocAssertDeleteSchema = z
  .object({
    /**
     * The current version of the document before the operation.
     * Undefined if the document does not exist.
     */
    current: DocSchema.optional(),

    /**
     * The proposed version of the document.
     * This can be validated before allowing the operation.
     */
    proposed: DelDocSchema
  })
  .strict();

/**
 * Represents a validation check before deleting a document.
 *
 * The developer can compare the `current` and `proposed` versions and
 * throw an error if their validation fails.
 */
export interface DocAssertDelete {
  current?: Doc;
  proposed: DelDoc;
}
