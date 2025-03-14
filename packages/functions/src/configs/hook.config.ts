import type {OnSetDocContext} from '../hooks/context';
import type {CollectionsConfig} from './collection.config';
import type {SatelliteConfigEnv} from './satellite.config';

/**
 * A generic configuration interface for defining hooks related to collections.
 *
 * @template T - The type of context passed to the hook when triggered.
 */
export interface OnHookConfig<T> extends CollectionsConfig {
  /**
   * A function that runs when the hook is triggered for the specified collections.
   *
   * @param {T} context - Contains information about the affected document(s).
   * @returns {Promise<void>} Resolves when the operation completes.
   */
  run: (context: T) => Promise<void>;
}

/**
 * Configuration for a hook that runs when a document is created or updated.
 */
export type OnSetDocConfig = OnHookConfig<OnSetDocContext>;

export type HookConfig = OnSetDocConfig; // TODO: to be extended

export type HookFn<T extends HookConfig> = (config: SatelliteConfigEnv) => T;

export type HookFnOrObject<T extends HookConfig> = T | HookFn<T>;

export function defineHook<T extends HookConfig>(config: T): T;
export function defineHook<T extends HookConfig>(config: HookFn<T>): HookFn<T>;
export function defineHook<T extends HookConfig>(config: HookFnOrObject<T>): HookFnOrObject<T>;
export function defineHook<T extends HookConfig>(config: HookFnOrObject<T>): HookFnOrObject<T> {
  return config;
}
