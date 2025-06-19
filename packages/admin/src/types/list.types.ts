import type {Rule} from '@junobuild/config';

/**
 * Represents matching parameters for a list call.
 * @interface
 */
export interface ListRulesMatcher {
  /**
   * Include the system collections (prefixed with #).
   * @type {boolean}
   */
  include_system: boolean;
}

/**
 * Represents the parameters for listing the rules.
 * @interface
 */
export interface ListRulesParams {
  /**
   * The matcher parameters for the query.
   * @type {ListRulesMatcher}
   */
  matcher?: ListRulesMatcher;
}

/**
 * Represents the results of list the rules.
 * @interface
 */
export interface ListRulesResults {
  /**
   * The rules matching the query.
   * @type {Rule[]}
   */
  items: Rule[];

  /**
   * The number of items - basically items.length.
   * @type {bigint}
   */
  items_length: bigint;

  /**
   * The total number of matching results.
   * @type {bigint}
   */
  matches_length: bigint;
}
