/**
 * Defines the collections where a hook or assertion should run.
 */
export interface CollectionsConfig {
  /**
   * An array containing at least one collection name where the hook or assertion will be executed.
   */
  collections: [string, ...string[]];
}
