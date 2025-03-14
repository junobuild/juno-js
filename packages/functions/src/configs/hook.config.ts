import * as z from 'zod';
import {OnSetDocContextSchema} from '../hooks/context';
import {CollectionsConfigSchema} from './collection.config';
import {SatelliteConfigEnvSchema} from './satellite.config';

/**
 * A generic configuration schema for defining hooks related to collections.
 *
 * @template T - The type of context passed to the hook when triggered.
 */
export const OnHookConfigSchema = <T extends z.ZodTypeAny>(contextSchema: T) =>
  CollectionsConfigSchema.extend({
    /**
     * A function that runs when the hook is triggered for the specified collections.
     *
     * @param {T} context - Contains information about the affected document(s).
     * @returns {Promise<void>} Resolves when the operation completes.
     */
    run: z.function().args(contextSchema).returns(z.promise(z.void()))
  });

/**
 * @see OnSetDocConfig
 */
export const OnSetDocConfigSchema = OnHookConfigSchema(OnSetDocContextSchema);

/**
 * Configuration for a hook that runs when a document is created or updated.
 */
export type OnSetDocConfig = z.infer<typeof OnSetDocConfigSchema>;

// TODO: to be extended
/**
 * @see HookConfig
 */
export const HookConfigSchema = OnSetDocConfigSchema;

/**
 * All possible config for assertions.
 */
export type HookConfig = z.infer<typeof HookConfigSchema>;

export const HookFnSchema = <T extends z.ZodTypeAny>(hookConfigSchema: T) =>
  z.function().args(SatelliteConfigEnvSchema).returns(hookConfigSchema);
export type HookFn<T extends HookConfig> = (config: z.infer<typeof SatelliteConfigEnvSchema>) => T;

export const HookFnOrObjectSchema = <T extends z.ZodTypeAny>(hookConfigSchema: T) =>
  z.union([hookConfigSchema, HookFnSchema(hookConfigSchema)]);
export type HookFnOrObject<T extends HookConfig> = T | HookFn<T>;

export function defineHook<T extends HookConfig>(config: T): T;
export function defineHook<T extends HookConfig>(config: HookFn<T>): HookFn<T>;
export function defineHook<T extends HookConfig>(config: HookFnOrObject<T>): HookFnOrObject<T>;
export function defineHook<T extends HookConfig>(config: HookFnOrObject<T>): HookFnOrObject<T> {
  return config;
}
