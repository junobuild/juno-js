import * as z from 'zod';
import {type Collections, CollectionsSchema} from './schemas/collections';
import {type RunFunction, RunFunctionSchema} from './schemas/context';
import {
  type OnDeleteDocContext,
  OnDeleteDocContextSchema,
  type OnDeleteFilteredDocsContext,
  OnDeleteFilteredDocsContextSchema,
  type OnDeleteManyDocsContext,
  OnDeleteManyDocsContextSchema,
  type OnSetDocContext,
  OnSetDocContextSchema,
  type OnSetManyDocsContext,
  OnSetManyDocsContextSchema
} from './schemas/db/context';
import {SatelliteEnvSchema} from './schemas/satellite.env';
import {
  OnDeleteAssetContext,
  OnDeleteAssetContextSchema,
  OnDeleteFilteredAssetsContext,
  OnDeleteFilteredAssetsContextSchema,
  OnDeleteManyAssetsContext,
  OnDeleteManyAssetsContextSchema,
  OnUploadAssetContext,
  OnUploadAssetContextSchema
} from './schemas/storage/context';

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
export type OnSetManyDocs = OnHook<OnSetManyDocsContext>;

/**
 * @see OnDeleteDoc
 */
export const OnDeleteDocSchema = OnHookSchema(OnDeleteDocContextSchema);

/**
 * A hook that runs when a single document is deleted.
 */
export type OnDeleteDoc = OnHook<OnDeleteDocContext>;

/**
 * @see OnDeleteManyDocs
 */
export const OnDeleteManyDocsSchema = OnHookSchema(OnDeleteManyDocsContextSchema);

/**
 * A hook that runs when multiple documents are deleted.
 */
export type OnDeleteManyDocs = OnHook<OnDeleteManyDocsContext>;

/**
 * @see OnDeleteFilteredDocs
 */
export const OnDeleteFilteredDocsSchema = OnHookSchema(OnDeleteFilteredDocsContextSchema);

/**
 * A hook that runs when a filtered set of documents is deleted based on query conditions.
 */
export type OnDeleteFilteredDocs = OnHook<OnDeleteFilteredDocsContext>;

/**
 * @see OnUploadAsset
 */
export const OnUploadAssetSchema = OnHookSchema(OnUploadAssetContextSchema);

/**
 * A hook that runs when a single asset is uploaded.
 */
export type OnUploadAsset = OnHook<OnUploadAssetContext>;

/**
 * @see OnDeleteAsset
 */
export const OnDeleteAssetSchema = OnHookSchema(OnDeleteAssetContextSchema);

/**
 * A hook that runs when a single asset is potentially deleted.
 */
export type OnDeleteAsset = OnHook<OnDeleteAssetContext>;

/**
 * @see OnDeleteManyAssets
 */
export const OnDeleteManyAssetsSchema = OnHookSchema(OnDeleteManyAssetsContextSchema);

/**
 * A hook that runs when multiple assets are potentially deleted.
 */
export type OnDeleteManyAssets = OnHook<OnDeleteManyAssetsContext>;

/**
 * @see OnDeleteFilteredAssets
 */
export const OnDeleteFilteredAssetsSchema = OnHookSchema(OnDeleteFilteredAssetsContextSchema);

/**
 * A hook that runs when a filtered set of assets is deleted based on query conditions.
 */
export type OnDeleteFilteredAssets = OnHook<OnDeleteFilteredAssetsContext>;

/**
 * @see Hook
 */
export const HookSchema = z.union([
  OnSetDocSchema,
  OnSetManyDocsSchema,
  OnDeleteDocContextSchema,
  OnDeleteManyDocsContextSchema,
  OnDeleteFilteredDocsContextSchema,
  OnUploadAssetSchema,
  OnDeleteAssetSchema,
  OnDeleteManyAssetsSchema,
  OnDeleteFilteredAssetsSchema
]);

/**
 * All hooks definitions.
 */
export type Hook =
  | OnSetDoc
  | OnSetManyDocs
  | OnDeleteDoc
  | OnDeleteManyDocs
  | OnDeleteFilteredDocs
  | OnUploadAsset
  | OnDeleteAsset
  | OnDeleteManyAssets
  | OnDeleteFilteredAssets;

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
