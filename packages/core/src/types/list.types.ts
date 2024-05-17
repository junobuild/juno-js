import type { Principal } from '@dfinity/principal';

/**
 * Represents the results of a list call.
 * @template T - The type of items in the list.
 * @interface
 */
export interface ListResults<T> {
  /**
   * The data - e.g., the documents or assets depending on which list was called.
   * @type {T[]}
   */
  items: T[];

  /**
   * The number of items - basically items.length.
   * @type {bigint}
   */
  items_length: bigint;

  /**
   * If the query is paginated, the page number (starting from 0) where the items are found.
   * @type {bigint}
   */
  items_page?: bigint;

  /**
   * The total number of matching results.
   * @type {bigint}
   */
  matches_length: bigint;

  /**
   * If the query is paginated, the total number of pages (starting from 0).
   * @type {bigint}
   */
  matches_pages?: bigint;
}

/**
 * Represents pagination parameters for a list call.
 * @interface
 */
export interface ListPaginate {
  /**
   * The key to start after for pagination.
   * @type {string}
   */
  startAfter?: string;

  /**
   * The maximum number of items to return.
   * @type {number}
   */
  limit?: number;
}

/**
 * Type representing the fields by which the list can be ordered.
 * @typedef {('keys' | 'updated_at' | 'created_at')} ListOrderField
 */
export type ListOrderField = 'keys' | 'updated_at' | 'created_at';

/**
 * Represents the order parameters for a list cal.
 * @interface
 */
export interface ListOrder {
  /**
   * Whether the order is descending.
   * @type {boolean}
   */
  desc: boolean;

  /**
   * The field by which to order the list.
   * @type {ListOrderField}
   */
  field: ListOrderField;
}

/**
 * Type representing the owner of a list item, either a string or a Principal.
 * @typedef {(string | Principal)} ListOwner
 */
export type ListOwner = string | Principal;

/**
 * Represents matching parameters for a list call.
 * @interface
 */
export interface ListMatcher {
  /**
   * The key to match. Support Regex (must comply with Rust regex).
   * @type {string}
   */
  key?: string;

  /**
   * The description to match. Support Regex (must comply with Rust regex).
   * @type {string}
   */
  description?: string;
}

/**
 * Represents the parameters for a list query.
 * @interface
 */
export interface ListParams {
  /**
   * The matcher parameters for the query.
   * @type {ListMatcher}
   */
  matcher?: ListMatcher;

  /**
   * The pagination parameters for the query.
   * @type {ListPaginate}
   */
  paginate?: ListPaginate;

  /**
   * The order parameters for the query.
   * @type {ListOrder}
   */
  order?: ListOrder;

  /**
   * The owner of the items to match.
   * @type {ListOwner}
   */
  owner?: ListOwner;
}
