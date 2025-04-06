import * as z from 'zod';
import {type Asset, AssetSchema} from '../../../schemas/storage';
import {HookContextSchema, type HookContext} from '../context';
import {AssetAssertUploadSchema, type AssetAssertUpload} from './payload';

/**
 * @see OnUploadAssetContext
 */
export const OnUploadAssetContextSchema = HookContextSchema(AssetSchema);

/**
 * Context for the `onUploadAsset` hook.
 *
 * This context contains information about the asset that was uploaded.
 */
export type OnUploadAssetContext = HookContext<Asset>;

/**
 * @see OnDeleteAssetContext
 */
export const OnDeleteAssetContextSchema = HookContextSchema(AssetSchema.optional());

/**
 * Context for the `onDeleteAsset` hook.
 *
 * This context contains information about a single asset being deleted, along with details about the user who triggered the operation.
 *
 * If undefined, the asset did not exist.
 */
export type OnDeleteAssetContext = HookContext<Asset | undefined>;

/**
 * @see OnDeleteManyAssetsContext
 */
export const OnDeleteManyAssetsContextSchema = HookContextSchema(z.array(AssetSchema.optional()));

/**
 * Context for the `onDeleteManyAssets` hook.
 *
 * This context contains information about multiple assets being potentially deleted, along with details about the user who triggered the operation.
 */
export type OnDeleteManyAssetsContext = HookContext<Array<Asset | undefined>>;

/**
 * @see OnDeleteFilteredAssetsContext
 */
export const OnDeleteFilteredAssetsContextSchema = HookContextSchema(
  z.array(AssetSchema.optional())
);

/**
 * Context for the `onDeleteFilteredAssets` hook.
 *
 * This context contains information about documents deleted as a result of a filter, along with details about the user who triggered the operation.
 */
export type OnDeleteFilteredAssetsContext = HookContext<Array<Asset | undefined>>;

/**
 * @see AssertUploadAssetContext
 */
export const AssertUploadAssetContextSchema = HookContextSchema(AssetAssertUploadSchema);

/**
 * Context for the `assertUploadAsset` hook.
 *
 * This context contains information about the asset being validated before it is uploaded. If validation fails, the developer should throw an error.
 */
export type AssertUploadAssetContext = HookContext<AssetAssertUpload>;

/**
 * @see AssertDeleteAssetContext
 */
export const AssertDeleteAssetContextSchema = HookContextSchema(AssetSchema);

/**
 * Context for the `assertDeleteAsset` hook.
 *
 * This context contains information about the asset being validated before it is deleted. If validation fails, the developer should throw an error.
 */
export type AssertDeleteAssetContext = HookContext<Asset>;
