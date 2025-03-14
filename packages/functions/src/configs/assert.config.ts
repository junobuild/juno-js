import type {AssertSetDocContext} from '../hooks/context';
import type {CollectionsConfig} from './collection.config';
import type {SatelliteConfigEnv} from './satellite.config';

/**
 * A generic configuration interface for defining assertions related to collections.
 *
 * @template T - The type of context passed to the assertions when triggered.
 */
export interface OnAssertConfig<T> extends CollectionsConfig {
  /**
   * A function that runs when the assertion is triggered for the specified collections.
   *
   * @param {T} context - Contains information about the affected document(s).
   * @returns {Promise<void>} Resolves when the operation completes.
   */
  assert: (context: T) => Promise<void>;
}

/**
 * Configuration for an assertion that runs when a document is created or updated.
 */
export type AssertSetDocConfig = OnAssertConfig<AssertSetDocContext>;

export type AssertConfig = AssertSetDocConfig; // TODO: to be extended

export type AssertFn<T extends AssertConfig> = (config: SatelliteConfigEnv) => T;

export type AssertFnOrObject<T extends AssertConfig> = T | AssertFn<T>;

export function defineAssert<T extends AssertConfig>(config: T): T;
export function defineAssert<T extends AssertConfig>(config: AssertFn<T>): AssertFn<T>;
export function defineAssert<T extends AssertConfig>(
  config: AssertFnOrObject<T>
): AssertFnOrObject<T>;
export function defineAssert<T extends AssertConfig>(
  config: AssertFnOrObject<T>
): AssertFnOrObject<T> {
  return config;
}
