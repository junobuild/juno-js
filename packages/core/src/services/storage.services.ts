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
import type {Asset, AssetEncoding, AssetKey, Assets, Storage} from '../types/storage.types';
import {sha256ToBase64String} from '../utils/crypto.utils';
import {satelliteUrl} from '../utils/env.utils';
import {getIdentity} from './identity.services';

export const uploadBlob = async (
  params: Storage & {satellite?: SatelliteOptions}
): Promise<AssetKey> => uploadAssetIC(params);

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

  return {
    assets: items.map(
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
    ),
    ...rest
  };
};

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
