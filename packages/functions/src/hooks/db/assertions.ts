import * as z from 'zod';
import {type Collections, CollectionsSchema} from '../schemas/collections';
import {type AssertFunction, AssertFunctionSchema} from '../schemas/context';
import {
  type AssertDeleteDocContext,
  AssertDeleteDocContextSchema,
  type AssertSetDocContext,
  AssertSetDocContextSchema
} from '../schemas/db/context';
import {SatelliteEnvSchema} from '../schemas/satellite.env';

/**
 * @see OnAssert
 */
const OnAssertSchema = <T extends z.ZodTypeAny>(contextSchema: T) =>
  CollectionsSchema.extend({
    /**
     * A function that runs when the assertion is triggered for the specified collections.
     *
     * @param {T} context - Contains information about the affected document(s).
     * @returns {void} Resolves when the assertion completes.
     */
    assert: AssertFunctionSchema<T>(contextSchema)
  }).strict();

/**
 * A generic schema for defining assertions related to collections.
 *
 * @template T - The type of context passed to the assertions when triggered.
 */
export type OnAssert<T> = Collections & {
  assert: AssertFunction<T>;
};

/**
 * @see AssertSetDoc
 */
export const AssertSetDocSchema = OnAssertSchema(AssertSetDocContextSchema);

/**
 * An assertion that runs when a document is created or updated.
 */
export type AssertSetDoc = OnAssert<AssertSetDocContext>;

/**
 * @see AssertDeleteDoc
 */
export const AssertDeleteDocSchema = OnAssertSchema(AssertDeleteDocContextSchema);

/**
 * An assertion that runs when a document is deleted.
 */
export type AssertDeleteDoc = OnAssert<AssertDeleteDocContext>;

/**
 * @see Assert
 */
export const AssertSchema = z.union([AssertSetDocSchema, AssertDeleteDocSchema]);

/**
 * All assertions definitions.
 */
export type Assert = AssertSetDoc | AssertDeleteDoc;

export const AssertFnSchema = <T extends z.ZodTypeAny>(assertSchema: T) =>
  z.function().args(SatelliteEnvSchema).returns(assertSchema);
export type AssertFn<T extends Assert> = (assert: z.infer<typeof SatelliteEnvSchema>) => T;

export const AssertFnOrObjectSchema = <T extends z.ZodTypeAny>(assertSchema: T) =>
  z.union([assertSchema, AssertFnSchema(assertSchema)]);
export type AssertFnOrObject<T extends Assert> = T | AssertFn<T>;

export function defineAssert<T extends Assert>(assert: T): T;
export function defineAssert<T extends Assert>(assert: AssertFn<T>): AssertFn<T>;
export function defineAssert<T extends Assert>(assert: AssertFnOrObject<T>): AssertFnOrObject<T>;
export function defineAssert<T extends Assert>(assert: AssertFnOrObject<T>): AssertFnOrObject<T> {
  return assert;
}
