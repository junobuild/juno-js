import type {OnSetDocContext} from '../hooks/context';
import type {CollectionsConfig} from './collection.config';
import type {SatelliteConfigEnv} from './satellite.config';

/**
 * The generic configuration for hooks that manage collections.
 */
export interface OnHookConfig extends CollectionsConfig {
  onSetDoc: never;
}

/**
 * A configuration object that includes the `onSetDoc` function.
 * This function is called when a document is created or updated.
 */
export interface OnSetDocConfig extends Omit<OnHookConfig, 'onSetDoc'> {
  /**
   * A function that runs when a document is set in the Datastore.
   *
   * @param {OnSetDocContext} context - Provides details about the document being saved.
   * @returns {Promise<void>} Resolves when your operation is complete.
   */
  onSetDoc: (context: OnSetDocContext) => Promise<void>;
}

export type HookConfig = OnSetDocConfig; // TODO: to be extended

export type HookFn = (config: SatelliteConfigEnv) => HookConfig;

export type HookFnOrObject = HookConfig | HookFn;

export function defineHook(config: HookConfig): HookConfig;
export function defineHook(config: HookFn): HookFn;
export function defineHook(config: HookFnOrObject): HookFnOrObject;
export function defineHook(config: HookFnOrObject): HookFnOrObject {
  return config;
}
