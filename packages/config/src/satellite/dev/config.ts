import type {JunoDevConfig} from './juno.dev.config';

export type JunoDevConfigFn = () => JunoDevConfig;

export type JunoDevConfigFnOrObject = JunoDevConfig | JunoDevConfigFn;

export function defineDevConfig(config: JunoDevConfig): JunoDevConfig;
export function defineDevConfig(config: JunoDevConfigFn): JunoDevConfigFn;
export function defineDevConfig(config: JunoDevConfigFnOrObject): JunoDevConfigFnOrObject;
export function defineDevConfig(config: JunoDevConfigFnOrObject): JunoDevConfigFnOrObject {
  return config;
}
