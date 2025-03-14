import * as z from 'zod';
import {OnSetDocContextSchema} from '../hooks/context';
import {CollectionsConfigSchema} from './collections.config';
import {SatelliteEnvSchema} from './satellite.env';

/**
 * A generic schema for defining hooks related to collections.
 *
 * @template T - The type of context passed to the hook when triggered.
 */
const OnHookSchema = <T extends z.ZodTypeAny>(contextSchema: T) =>
  CollectionsConfigSchema.extend({
    /**
     * A function that runs when the hook is triggered for the specified collections.
     *
     * @param {T} context - Contains information about the affected document(s).
     * @returns {Promise<void>} Resolves when the operation completes.
     */
    run: z.function().args(contextSchema).returns(z.promise(z.void()))
  }).strict();

/**
 * @see OnSetDoc
 */
export const OnSetDocSchema = OnHookSchema(OnSetDocContextSchema);

/**
 * A hook that runs when a document is created or updated.
 */
export type OnSetDoc = z.infer<typeof OnSetDocSchema>;

// TODO: to be extended
/**
 * @see Hook
 */
export const HookSchema = OnSetDocSchema;

/**
 * All hooks definitions.
 */
export type Hook = z.infer<typeof HookSchema>;

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
