export type * from './types/encoding';
export type * from './types/juno.config';
export type * from './types/juno.env';
export type * from './types/satellite.config';
export type * from './types/storage.config';
export type * from './types/utility';

/// Export and expose functions for user configuration

import type {JunoConfig} from './types/juno.config';
import type {JunoConfigEnv} from './types/juno.env';

export type JunoConfigFn = (config: JunoConfigEnv) => JunoConfig;

export type JunoConfigFnOrObject = JunoConfig | JunoConfigFn;

export function defineConfig(config: JunoConfig): JunoConfig;
export function defineConfig(config: JunoConfigFn): JunoConfigFn;
export function defineConfig(config: JunoConfigFnOrObject): JunoConfigFnOrObject;
export function defineConfig(config: JunoConfigFnOrObject): JunoConfigFnOrObject {
  return config;
}
