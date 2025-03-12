import {AssertSetDocContext} from '../hooks/context';
import {CollectionsConfig} from './collection.config';
import {SatelliteConfigEnv} from './satellite.config';

export interface AssertAssertConfig extends CollectionsConfig {
  assertSetDoc: never;
}

export interface AssertSetDocConfig extends Omit<AssertAssertConfig, 'assertSetDoc'> {
  assertSetDoc: (context: AssertSetDocContext) => void;
}

export type AssertConfig = AssertSetDocConfig;

export type AssertFn = (config: SatelliteConfigEnv) => AssertConfig;

export type AssertFnOrObject = AssertConfig | AssertFn;

export function defineAssert(config: AssertConfig): AssertConfig;
export function defineAssert(config: AssertFn): AssertFn;
export function defineAssert(config: AssertFnOrObject): AssertFnOrObject;
export function defineAssert(config: AssertFnOrObject): AssertFnOrObject {
  return config;
}
