import * as z from 'zod';
import {AssertSetDocContextSchema} from '../hooks/context';
import {CollectionsConfigSchema} from './collections.config';
import {SatelliteConfigEnvSchema} from './satellite.config';

/**
 * A generic configuration schema for defining assertions related to collections.
 *
 * @template T - The type of context passed to the assertions when triggered.
 */
const OnAssertConfigSchema = <T extends z.ZodTypeAny>(contextSchema: T) =>
  CollectionsConfigSchema.extend({
    /**
     * A function that runs when the assertion is triggered for the specified collections.
     *
     * @param {T} context - Contains information about the affected document(s).
     * @returns {Promise<void>} Resolves when the operation completes.
     */
    assert: z.function().args(contextSchema).returns(z.promise(z.void()))
  }).strict();

/**
 * @see AssertSetDocConfig
 */
export const AssertSetDocConfigSchema = OnAssertConfigSchema(AssertSetDocContextSchema);

/**
 * Configuration schema for an assertion that runs when a document is created or updated.
 */
export type AssertSetDocConfig = z.infer<typeof AssertSetDocConfigSchema>;

// TODO: to be extended
/**
 * @see AssertConfig
 */
export const AssertConfigSchema = AssertSetDocConfigSchema;

/**
 * All possible config for assertions.
 */
export type AssertConfig = z.infer<typeof AssertConfigSchema>;

export const AssertFnSchema = <T extends z.ZodTypeAny>(hookConfigSchema: T) =>
  z.function().args(SatelliteConfigEnvSchema).returns(hookConfigSchema);
export type AssertFn<T extends AssertConfig> = (
  config: z.infer<typeof SatelliteConfigEnvSchema>
) => T;

export const AssertFnOrObjectSchema = <T extends z.ZodTypeAny>(hookConfigSchema: T) =>
  z.union([hookConfigSchema, AssertFnSchema(hookConfigSchema)]);
export type AssertFnOrObject<T extends AssertConfig> = T | AssertFn<T>;

export function defineAssert<T extends AssertConfig>(config: T): T;
export function defineAssert<T extends AssertConfig>(config: AssertFn<T>): AssertFn<T>;
export function defineAssert<T extends AssertConfig>(
  config: AssertFnOrObject<T>
): AssertFnOrObject<T>;
export function defineAssert<T extends AssertConfig>(
  config: AssertFnOrObject<T>
): AssertFnOrObject<T> {
  return config;
}
