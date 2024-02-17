export type * from './dev/juno.dev.config';
export type * from './mainnet/juno.config';
export type * from './mainnet/juno.env';
export type * from './mainnet/satellite.config';
export type * from './mainnet/storage.config';
export type * from './types/encoding';
export type * from './types/rules';
export type * from './utils/ts.utils';

/// Export and expose functions for user configuration

import type {JunoConfig} from './mainnet/juno.config';
import type {JunoConfigEnv} from './mainnet/juno.env';

export type JunoConfigFn = (config: JunoConfigEnv) => JunoConfig;

export type JunoConfigFnOrObject = JunoConfig | JunoConfigFn;

export function defineConfig(config: JunoConfig): JunoConfig;
export function defineConfig(config: JunoConfigFn): JunoConfigFn;
export function defineConfig(config: JunoConfigFnOrObject): JunoConfigFnOrObject;
export function defineConfig(config: JunoConfigFnOrObject): JunoConfigFnOrObject {
  return config;
}
