import type {JunoConfigEnv} from '../types/juno.env';
import type {JunoConsoleConfig} from './console.config';

export type JunoConsoleConfigFn = (config: JunoConfigEnv) => JunoConsoleConfig;

export type JunoConsoleConfigFnOrObject = JunoConsoleConfig | JunoConsoleConfigFn;

export function defineConsoleConfig(config: JunoConsoleConfig): JunoConsoleConfig;
export function defineConsoleConfig(config: JunoConsoleConfigFn): JunoConsoleConfigFn;
export function defineConsoleConfig(
  config: JunoConsoleConfigFnOrObject
): JunoConsoleConfigFnOrObject;
export function defineConsoleConfig(
  config: JunoConsoleConfigFnOrObject
): JunoConsoleConfigFnOrObject {
  return config;
}
