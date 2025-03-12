import {OnSetDocContext} from '../hooks/context';
import {CollectionsConfig} from './collection.config';
import {SatelliteConfigEnv} from './satellite.config';

export interface OnHookConfig extends CollectionsConfig {
  onSetDoc: never;
}

export interface OnSetDocConfig extends Omit<OnHookConfig, 'onSetDoc'> {
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
