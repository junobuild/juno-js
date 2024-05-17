/**
 * Represents a document stored in a collection.
 * @template D - The type of data contained in the document.
 * @interface
 */
export interface Doc<D> {
  /**
   * The unique key identifying the document within the collection.
   * @type {string}
   */
  key: string;

  /**
   * An optional description of the document which can also be used to filter document when listing those.
   * @type {string}
   */
  description?: string;

  /**
   * The data contained in the document.
   * @type {D}
   */
  data: D;

  /**
   * The owner of the document.
   * @type {string}
   */
  owner?: string;

  /**
   * The timestamp when the document was created.
   * @type {bigint}
   */
  created_at?: bigint;

  /**
   * The timestamp when the document was last updated.
   * @type {bigint}
   */
  updated_at?: bigint;

  /**
   * The version of the document. When updating a document, the current version must be provided to ensure the correct document is updated.
   * @type {bigint}
   */
  version?: bigint;
}
