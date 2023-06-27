import type {AssetNoContent} from '../../declarations/satellite/satellite.did';
import {
  deleteAsset as deleteAssetApi,
  deleteAssets as deleteAssetsApi,
  listAssets as listAssetsApi,
  uploadAsset as uploadAssetApi
} from '../api/storage.api';
import type {ListParams, ListResults} from '../types/list.types';
import type {SatelliteOptions} from '../types/satellite.types';
import type {Asset, AssetEncoding, AssetKey, Assets, Storage} from '../types/storage.types';
import {sha256ToBase64String} from '../utils/crypto.utils';
import {fromNullable} from '../utils/did.utils';
import {satelliteUrl} from '../utils/env.utils';
import {encodeFilename} from '../utils/storage.utils';
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
  satellite,
  encoding,
  description
}: Storage & {satellite?: SatelliteOptions}): Promise<AssetKey> => {
  const identity = getIdentity(satellite?.identity);

  const filename: string = encodeFilename(storageFilename);
  const fullPath: string = storagePath || `/${collection}/${filename}`;

  await uploadAssetApi({
    data,
    filename: encodeFilename(filename),
    collection,
    token,
    headers,
    fullPath,
    encoding,
    satellite: {...satellite, identity},
    description
  });

  return {
    downloadUrl: `${satelliteUrl()}${fullPath}${token !== undefined ? `?token=${token}` : ''}`,
    fullPath,
    name: filename
  };
};

export const listAssets = async ({
  collection,
  satellite,
  filter
}: {
  collection: string;
  satellite?: SatelliteOptions;
  filter?: ListParams;
}): Promise<Assets> => {
  const {items, ...rest}: ListResults<AssetNoContent> = await listAssetsApi({
    collection,
    satellite: {...satellite, identity: getIdentity(satellite?.identity)},
    filter: filter ?? {}
  });

  const host: string = satelliteUrl();

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
  storageFile,
  collection,
  satellite
}: {
  storageFile: Asset;
  collection: string;
  satellite?: SatelliteOptions;
}): Promise<void> =>
  deleteAssetApi({
    collection,
    storageFile,
    satellite: {...satellite, identity: getIdentity(satellite?.identity)}
  });

export const deleteAssets = async ({
  collection,
  satellite
}: {
  collection: string;
  satellite?: SatelliteOptions;
}): Promise<void> =>
  deleteAssetsApi({
    collection,
    satellite: {...satellite, identity: getIdentity(satellite?.identity)}
  });
