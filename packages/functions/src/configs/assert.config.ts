import {AssertSetDocContext} from '../hooks/context';
import {CollectionsConfig} from './collection.config';
import {SatelliteConfigEnv} from './satellite.config';

/**
 * The generic configuration for assertion hooks that manage collections.
 */
export interface AssertAssertConfig extends CollectionsConfig {
  assertSetDoc: never;
}

/**
 * A configuration object that includes the `assertSetDoc` function.
 * This function is called to validate a document before it is created or updated.
 */
export interface AssertSetDocConfig extends Omit<AssertAssertConfig, 'assertSetDoc'> {
  /**
   * A function that runs synchronously before a document is set in the Datastore.
   * This can be used to enforce your validation rules.
   *
   * @param {AssertSetDocContext} context - Provides details about the document being validated.
   * @throws {Error} If your validation fails, throw an exception to prevent the document from being saved.
   *
   */
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
