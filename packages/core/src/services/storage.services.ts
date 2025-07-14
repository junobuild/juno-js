import {fromNullable, nonNullish} from '@dfinity/utils';
import type {Asset, AssetEncoding, AssetKey, Storage} from '@junobuild/storage';
import type {AssetNoContent} from '../../declarations/satellite/satellite.did';
import {
  countAssets as countAssetsApi,
  deleteAsset as deleteAssetApi,
  deleteFilteredAssets as deleteFilteredAssetsApi,
  deleteManyAssets as deleteManyAssetsApi,
  getAsset as getAssetApi,
  getManyAssets as getManyAssetsApi,
  listAssets as listAssetsApi,
  uploadAsset as uploadAssetApi
} from '../api/storage.api';
import type {ListParams} from '../types/list';
import type {SatelliteOptions} from '../types/satellite';
import type {Assets} from '../types/storage.types';
import {sha256ToBase64String} from '../utils/crypto.utils';
import {satelliteUrl} from '../utils/env.utils';
import {getAnyIdentity} from './identity.services';

/**
 * Uploads a blob to the storage.
 * @param {Storage & {satellite?: SatelliteOptions}} params - The storage parameters. Satellite options are required only in NodeJS environment.
 * @returns {Promise<AssetKey>} A promise that resolves to the asset key.
 */
export const uploadBlob = (params: Storage & {satellite?: SatelliteOptions}): Promise<AssetKey> =>
  uploadAssetIC(params);

/**
 * Uploads a file to the storage.
 * @param {Partial<Pick<Storage, 'filename'>> & Omit<Storage, 'filename' | 'data'> & {data: File} & {satellite?: SatelliteOptions}} params - The storage parameters. Satellite options are required only in NodeJS environment.
 * @returns {Promise<AssetKey>} A promise that resolves to the asset key.
 */
export const uploadFile = (
  params: Partial<Pick<Storage, 'filename'>> &
    Omit<Storage, 'filename' | 'data'> & {data: File} & {satellite?: SatelliteOptions}
): Promise<AssetKey> =>
  uploadAssetIC({
    filename: params.data.name,
    ...params
  });

const uploadAssetIC = async ({
  filename: storageFilename,
  data,
  collection,
  headers = [],
  fullPath: storagePath,
  token,
  satellite: satelliteOptions,
  encoding,
  description
}: Storage & {satellite?: SatelliteOptions}): Promise<AssetKey> => {
  const identity = getAnyIdentity(satelliteOptions?.identity);

  // The IC certification does not currently support encoding
  const filename: string = decodeURI(storageFilename);
  const fullPath: string = storagePath ?? `/${collection}/${filename}`;

  const satellite = {...satelliteOptions, identity};

  await uploadAssetApi({
    asset: {
      data,
      filename,
      collection,
      token,
      headers,
      fullPath,
      encoding,
      description
    },
    satellite,
    options: {certified: true}
  });

  return {
    downloadUrl: downloadUrl({
      satellite,
      assetKey: {
        fullPath,
        token
      }
    }),
    fullPath,
    name: filename
  };
};

/**
 * Lists assets in a collection with optional filtering.
 * @param {Object} params - The parameters for listing the assets.
 * @param {string} params.collection - The name of the collection.
 * @param {SatelliteOptions} [params.satellite] - The satellite options (required only in NodeJS environment).
 * @param {ListParams} [params.filter] - The filter parameters.
 * @returns {Promise<Assets>} A promise that resolves to the list of assets.
 */
export const listAssets = async ({
  collection,
  satellite: satelliteOptions,
  filter
}: {
  collection: string;
  satellite?: SatelliteOptions;
  filter?: ListParams;
}): Promise<Assets> => {
  const satellite = {...satelliteOptions, identity: getAnyIdentity(satelliteOptions?.identity)};

  // TODO
  const {items, ...rest} = await listAssetsApi({
    collection,
    satellite,
    filter: filter ?? {},
    options: {certified: false}
  });

  const assets = items.map(
    ({
      key: {full_path: fullPath, token: t, name, owner, description},
      headers,
      encodings,
      created_at,
      updated_at
    }: AssetNoContent) => {
      const token = fromNullable(t);

      return {
        fullPath,
        description: fromNullable(description),
        name,
        downloadUrl: downloadUrl({
          satellite,
          assetKey: {fullPath, token}
        }),
        token,
        headers,
        encodings: encodings.reduce<Record<string, AssetEncoding>>(
          (acc, [type, {modified, sha256, total_length}]) => ({
            ...acc,
            [type]: {
              modified,
              sha256: sha256ToBase64String(sha256),
              total_length
            }
          }),
          {}
        ),
        owner: owner.toText(),
        created_at,
        updated_at
      } as Asset;
    }
  );

  return {
    items: assets,
    assets,
    ...rest
  };
};

/**
 * Counts assets in a collection with optional filtering.
 * @param {Object} params - The parameters for counting the assets.
 * @param {string} params.collection - The name of the collection.
 * @param {SatelliteOptions} [params.satellite] - The satellite options (required only in NodeJS environment).
 * @param {ListParams} [params.filter] - The filter parameters for narrowing down the count.
 * @returns {Promise<bigint>} A promise that resolves to the count of assets as a bigint.
 */
export const countAssets = async ({
  collection,
  satellite: satelliteOptions,
  filter
}: {
  collection: string;
  satellite?: SatelliteOptions;
  filter?: ListParams;
}): Promise<bigint> => {
  const satellite = {...satelliteOptions, identity: getAnyIdentity(satelliteOptions?.identity)};

  // TODO
  return await countAssetsApi({
    collection,
    satellite,
    filter: filter ?? {},
    options: {certified: false}
  });
};

/**
 * Deletes an asset from the storage.
 * @param {Object} params - The parameters for deleting the asset.
 * @param {string} params.collection - The name of the collection.
 * @param {SatelliteOptions} [params.satellite] - The satellite options (required only in NodeJS environment).
 * @param {string} params.fullPath - The full path of the asset.
 * @returns {Promise<void>} A promise that resolves when the asset is deleted.
 */
export const deleteAsset = ({
  collection,
  fullPath,
  satellite
}: {
  collection: string;
  satellite?: SatelliteOptions;
} & Pick<AssetKey, 'fullPath'>): Promise<void> =>
  deleteAssetApi({
    collection,
    fullPath,
    satellite: {...satellite, identity: getAnyIdentity(satellite?.identity)},
    options: {certified: true}
  });

/**
 * Deletes multiple assets from the storage.
 * @param {Object} params - The parameters for deleting the assets.
 * @param {Array} params.assets - The list of assets with their collections and full paths.
 * @param {SatelliteOptions} [params.satellite] - The satellite options (required only in NodeJS environment).
 * @returns {Promise<void>} A promise that resolves when the assets are deleted.
 */
export const deleteManyAssets = ({
  assets,
  satellite
}: {
  assets: ({collection: string} & Pick<AssetKey, 'fullPath'>)[];
  satellite?: SatelliteOptions;
}): Promise<void> =>
  deleteManyAssetsApi({
    assets,
    satellite: {...satellite, identity: getAnyIdentity(satellite?.identity)},
    options: {certified: true}
  });

/**
 * Deletes multiple assets from a collection based on filtering criteria.
 *
 * @param {Object} params - The parameters for deleting the assets.
 * @param {string} params.collection - The name of the collection from which to delete assets.
 * @param {SatelliteOptions} [params.satellite] - The satellite options (required only in NodeJS environment).
 * @param {ListParams} [params.filter] - The filter criteria to match assets for deletion.
 *
 * @returns {Promise<void>} A promise that resolves when the assets matching the filter criteria are deleted.
 */
export const deleteFilteredAssets = async ({
  collection,
  satellite: satelliteOptions,
  filter
}: {
  collection: string;
  satellite?: SatelliteOptions;
  filter?: ListParams;
}): Promise<void> => {
  const satellite = {...satelliteOptions, identity: getAnyIdentity(satelliteOptions?.identity)};

  return await deleteFilteredAssetsApi({
    collection,
    satellite,
    filter: filter ?? {},
    options: {certified: true}
  });
};

/**
 * Retrieves an asset from the storage.
 * @param {Object} params - The parameters for retrieving the asset.
 * @param {string} params.collection - The name of the collection.
 * @param {SatelliteOptions} [params.satellite] - The satellite options (required only in NodeJS environment).
 * @param {string} params.fullPath - The full path of the asset.
 * @returns {Promise<AssetNoContent | undefined>} A promise that resolves to the asset or undefined if not found.
 */
export const getAsset = async ({
  satellite,
  ...rest
}: {
  collection: string;
  satellite?: SatelliteOptions;
} & Pick<AssetKey, 'fullPath'>): Promise<AssetNoContent | undefined> => {
  const identity = getAnyIdentity(satellite?.identity);

  // TODO
  return await getAssetApi({
    ...rest,
    satellite: {...satellite, identity},
    options: {certified: false}
  });
};

/**
 * Retrieves multiple assets from the storage.
 * @param {Object} params - The parameters for retrieving the assets.
 * @param {Array} params.assets - The list of assets with their collections and full paths.
 * @param {SatelliteOptions} [params.satellite] - The satellite options (required only in NodeJS environment).
 * @returns {Promise<Array<AssetNoContent | undefined>>} A promise that resolves to an array of assets or undefined if not found.
 */
export const getManyAssets = async ({
  satellite,
  ...rest
}: {
  assets: ({collection: string} & Pick<AssetKey, 'fullPath'>)[];
  satellite?: SatelliteOptions;
}): Promise<(AssetNoContent | undefined)[]> => {
  const identity = getAnyIdentity(satellite?.identity);

  // TODO
  return await getManyAssetsApi({
    ...rest,
    satellite: {...satellite, identity},
    options: {certified: false}
  });
};

/**
 * Returns a public URL for accessing a specific asset stored on a Satellite.
 *
 * This URL can be used to:
 * - Open the file directly in a browser
 * - Embed the asset in HTML elements like `<img src="...">`, `<video src="...">`, or `<a href="...">`
 * - Programmatically download or display the asset in your application
 *
 * ### Example
 * ```ts
 * const url = downloadUrl({
 *   assetKey: {
 *     fullPath: '/images/logo.png',
 *   }
 * });
 *
 * // Usage in an <img> tag
 * <img src={url} alt="Logo" />
 * ```
 *
 * @param {Object} params - Parameters for generating the URL.
 * @param {Object} params.assetKey - Identifies the asset to generate the URL for.
 * @param {string} params.assetKey.fullPath - The full path of the asset (e.g., `/folder/file.jpg`).
 * @param {string} [params.assetKey.token] - Optional access token for accessing protected assets.
 * @param {SatelliteOptions} [params.satellite] - Required only in Node.js environments to specify which Satellite to use.
 *
 * @returns {string} A full URL pointing to the asset.
 */
export const downloadUrl = ({
  assetKey: {fullPath, token},
  satellite: satelliteOptions
}: {
  assetKey: Pick<Asset, 'fullPath' | 'token'>;
} & {satellite?: SatelliteOptions}): string => {
  const satellite = {...satelliteOptions, identity: getAnyIdentity(satelliteOptions?.identity)};

  return `${satelliteUrl(satellite)}${fullPath}${nonNullish(token) ? `?token=${token}` : ''}`;
};
