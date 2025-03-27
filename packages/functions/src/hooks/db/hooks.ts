import * as z from 'zod';
import {type Collections, CollectionsSchema} from '../schemas/collections';
import {type RunFunction, RunFunctionSchema} from '../schemas/context';
import {
  type OnSetDocContext,
  OnSetDocContextSchema,
  OnSetManyDocsContextSchema
} from '../schemas/db/context';
import {SatelliteEnvSchema} from '../schemas/satellite.env';

/**
 * @see OnHook
 */
const OnHookSchema = <T extends z.ZodTypeAny>(contextSchema: T) =>
  CollectionsSchema.extend({
    run: RunFunctionSchema<T>(contextSchema)
  }).strict();

/**
 * A generic schema for defining hooks related to collections.
 *
 * @template T - The type of context passed to the hook when triggered.
 */
export type OnHook<T> = Collections & {
  /**
   * A function that runs when the hook is triggered for the specified collections.
   *
   * @param {T} context - Contains information about the affected document(s).
   * @returns {Promise<void>} Resolves when the operation completes.
   */
  run: RunFunction<T>;
};

/**
 * @see OnSetDoc
 */
export const OnSetDocSchema = OnHookSchema(OnSetDocContextSchema);

/**
 * A hook that runs when a document is created or updated.
 */
export type OnSetDoc = OnHook<OnSetDocContext>;

/**
 * @see OnSetManyDocs
 */
export const OnSetManyDocsSchema = OnHookSchema(OnSetManyDocsContextSchema);

/**
 * A hook that runs when multiple documents are created or updated.
 */
export type OnSetManyDocs = OnHook<OnSetDocContext>;

/**
 * @see Hook
 */
export const HookSchema = z.union([OnSetDocSchema, OnSetManyDocsSchema]);

/**
 * All hooks definitions.
 */
export type Hook = OnSetDoc | OnSetManyDocs;

export const HookFnSchema = <T extends z.ZodTypeAny>(hookSchema: T) =>
  z.function().args(SatelliteEnvSchema).returns(hookSchema);
export type HookFn<T extends Hook> = (hook: z.infer<typeof SatelliteEnvSchema>) => T;

export const HookFnOrObjectSchema = <T extends z.ZodTypeAny>(hookSchema: T) =>
  z.union([hookSchema, HookFnSchema(hookSchema)]);
export type HookFnOrObject<T extends Hook> = T | HookFn<T>;

export function defineHook<T extends Hook>(hook: T): T;
export function defineHook<T extends Hook>(hook: HookFn<T>): HookFn<T>;
export function defineHook<T extends Hook>(hook: HookFnOrObject<T>): HookFnOrObject<T>;
export function defineHook<T extends Hook>(hook: HookFnOrObject<T>): HookFnOrObject<T> {
  return hook;
}
