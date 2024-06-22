import type {Asset, AssetEncoding, AssetKey, Assets, Storage} from '@junobuild/storage';
import {fromNullable} from '@junobuild/utils';
import type {AssetNoContent} from '../../declarations/satellite/satellite.did';
import {
  deleteAsset as deleteAssetApi,
  deleteManyAssets as deleteManyAssetsApi,
  getAsset as getAssetApi,
  getManyAssets as getManyAssetsApi,
  listAssets as listAssetsApi,
  uploadAsset as uploadAssetApi
} from '../api/storage.api';
import type {ListParams, ListResults} from '../types/list.types';
import type {SatelliteOptions} from '../types/satellite.types';
import {sha256ToBase64String} from '../utils/crypto.utils';
import {satelliteUrl} from '../utils/env.utils';
import {getIdentity} from './identity.services';

/**
 * Uploads a blob to the storage.
 * @param {Storage & {satellite?: SatelliteOptions}} params - The storage parameters. Satellite options are required only in NodeJS environment.
 * @returns {Promise<AssetKey>} A promise that resolves to the asset key.
 */
export const uploadBlob = async (
  params: Storage & {satellite?: SatelliteOptions}
): Promise<AssetKey> => uploadAssetIC(params);

/**
 * Uploads a file to the storage.
 * @param {Partial<Pick<Storage, 'filename'>> & Omit<Storage, 'filename' | 'data'> & {data: File} & {satellite?: SatelliteOptions}} params - The storage parameters. Satellite options are required only in NodeJS environment.
 * @returns {Promise<AssetKey>} A promise that resolves to the asset key.
 */
export const uploadFile = async (
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
  const identity = getIdentity(satelliteOptions?.identity);

  // The IC certification does not currently support encoding
  const filename: string = decodeURI(storageFilename);
  const fullPath: string = storagePath ?? `/${collection}/${filename}`;

  const satellite = {...satelliteOptions, identity};

  await uploadAssetApi({
    data,
    filename,
    collection,
    token,
    headers,
    fullPath,
    encoding,
    satellite,
    description
  });

  return {
    downloadUrl: `${satelliteUrl(satellite)}${fullPath}${token !== undefined ? `?token=${token}` : ''}`,
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
  const satellite = {...satelliteOptions, identity: getIdentity(satelliteOptions?.identity)};

  const {items, ...rest}: ListResults<AssetNoContent> = await listAssetsApi({
    collection,
    satellite,
    filter: filter ?? {}
  });

  const host: string = satelliteUrl(satellite);

  const assets = items.map(
    ({
      key: {full_path, token: t, name, owner, description},
      headers,
      encodings,
      created_at,
      updated_at
    }: AssetNoContent) => {
      const token = fromNullable(t);

      return {
        fullPath: full_path,
        description: fromNullable(description),
        name,
        downloadUrl: `${host}${full_path}${token !== undefined ? `?token=${token}` : ''}`,
        token,
        headers,
        encodings: encodings.reduce(
          (acc, [type, {modified, sha256, total_length}]) => ({
            ...acc,
            [type]: {
              modified,
              sha256: sha256ToBase64String(sha256),
              total_length
            }
          }),
          {} as Record<string, AssetEncoding>
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
 * Deletes an asset from the storage.
 * @param {Object} params - The parameters for deleting the asset.
 * @param {string} params.collection - The name of the collection.
 * @param {SatelliteOptions} [params.satellite] - The satellite options (required only in NodeJS environment).
 * @param {string} params.fullPath - The full path of the asset.
 * @returns {Promise<void>} A promise that resolves when the asset is deleted.
 */
export const deleteAsset = async ({
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
    satellite: {...satellite, identity: getIdentity(satellite?.identity)}
  });

/**
 * Deletes multiple assets from the storage.
 * @param {Object} params - The parameters for deleting the assets.
 * @param {Array} params.assets - The list of assets with their collections and full paths.
 * @param {SatelliteOptions} [params.satellite] - The satellite options (required only in NodeJS environment).
 * @returns {Promise<void>} A promise that resolves when the assets are deleted.
 */
export const deleteManyAssets = async ({
  assets,
  satellite
}: {
  assets: ({collection: string} & Pick<AssetKey, 'fullPath'>)[];
  satellite?: SatelliteOptions;
} & Pick<AssetKey, 'fullPath'>): Promise<void> =>
  deleteManyAssetsApi({
    assets,
    satellite: {...satellite, identity: getIdentity(satellite?.identity)}
  });

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
  const identity = getIdentity(satellite?.identity);

  return getAssetApi({...rest, satellite: {...satellite, identity}});
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
  const identity = getIdentity(satellite?.identity);

  return getManyAssetsApi({...rest, satellite: {...satellite, identity}});
};
