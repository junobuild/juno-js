import type {RawData, RawUserId, Timestamp, Version} from './core';

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
  description?: string;

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
 * Represents a request to set or update a document.
 *
 * This is used when submitting new document data.
 */
export interface SetDoc {
  /**
   * The raw data of the document.
   */
  data: RawData;

  /**
   * An optional description of the document.
   */
  description?: string;

  /**
   * The expected version number to ensure consistency.
   * If provided, the operation will fail if the stored version does not match.
   */
  version?: Version;
}
