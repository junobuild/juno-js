import {z} from 'zod/v4';
import {
  type DelDoc,
  DelDocSchema,
  type Doc,
  DocSchema,
  type SetDoc,
  SetDocSchema
} from '../../../schemas/db';

/**
 * @see DocUpsert
 */
export const DocUpsertSchema = z
  .object({
    before: DocSchema.optional(),
    after: DocSchema
  })
  .strict();

/**
 * Represents a document update operation.
 *
 * This is used in hooks where a document is either being created or updated.
 */
export interface DocUpsert {
  /**
   * The previous version of the document before the update.
   * Undefined if this is a new document.
   */
  before?: Doc;

  /**
   * The new version of the document after the update.
   */
  after: Doc;
}
/**
 * @see DocAssertSet
 */
export const DocAssertSetSchema = z
  .object({
    current: DocSchema.optional(),
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
  /**
   * The current version of the document before the operation.
   * Undefined if this is a new document.
   */
  current?: Doc;

  /**
   * The proposed version of the document.
   * This can be validated before allowing the operation.
   */
  proposed: SetDoc;
}

/**
 * @see DocAssertDelete
 */
export const DocAssertDeleteSchema = z
  .object({
    current: DocSchema.optional(),
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
  /**
   * The current version of the document before the operation.
   * Undefined if the document does not exist.
   */
  current?: Doc;

  /**
   * The proposed version of the document.
   * This can be validated before allowing the operation.
   */
  proposed: DelDoc;
}
