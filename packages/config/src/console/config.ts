import type {JunoConfigEnv} from '../types/juno.env';
import type {JunoConsoleConfig} from './console.config';

export type JunoConsoleConfigFn = (config: JunoConfigEnv) => JunoConsoleConfig;

export type JunoConsoleConfigFnOrObject = JunoConsoleConfig | JunoConsoleConfigFn;

export function defineJunoConsoleConfig(config: JunoConsoleConfig): JunoConsoleConfig;
export function defineJunoConsoleConfig(config: JunoConsoleConfigFn): JunoConsoleConfigFn;
export function defineJunoConsoleConfig(
  config: JunoConsoleConfigFnOrObject
): JunoConsoleConfigFnOrObject;
export function defineJunoConsoleConfig(
  config: JunoConsoleConfigFnOrObject
): JunoConsoleConfigFnOrObject {
  return config;
}
