import type {JunoConfigEnv} from '../types/juno.env';
import type {JunoConfig} from './juno.config';

export type JunoConfigFn = (config: JunoConfigEnv) => JunoConfig;

export type JunoConfigFnOrObject = JunoConfig | JunoConfigFn;

export function defineConfig(config: JunoConfig): JunoConfig;
export function defineConfig(config: JunoConfigFn): JunoConfigFn;
export function defineConfig(config: JunoConfigFnOrObject): JunoConfigFnOrObject;
export function defineConfig(config: JunoConfigFnOrObject): JunoConfigFnOrObject {
  return config;
}
