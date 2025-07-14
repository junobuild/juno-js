import {fromNullable} from '@dfinity/utils';
import {
  uploadAsset as uploadAssetStorage,
  type AssetKey,
  type UploadAsset
} from '@junobuild/storage';
import type {AssetNoContent} from '../../declarations/satellite/satellite.did';
import type {ListParams, ListResults} from '../types/list';
import type {SatelliteContext} from '../types/satellite';
import {toListParams} from '../utils/list.utils';
import {getSatelliteActor} from './actor.api';

export const uploadAsset = async ({
  satellite,
  ...asset
}: UploadAsset & {satellite: SatelliteContext}): Promise<void> => {
  const actor = await getSatelliteActor({satellite, options: {certified: true}});

  await uploadAssetStorage({
    actor,
    asset
  });
};

export const listAssets = async ({
  collection,
  satellite,
  filter
}: {
  collection: string;
  satellite: SatelliteContext;
  filter: ListParams;
}): Promise<ListResults<AssetNoContent>> => {
  // TODO
  const {list_assets} = await getSatelliteActor({satellite, options: {certified: false}});

  const {
    items: assets,
    items_length,
    items_page,
    matches_length,
    matches_pages
  } = await list_assets(collection, toListParams(filter));

  return {
    items: assets.map(([_, asset]) => asset),
    items_length,
    items_page: fromNullable(items_page),
    matches_length,
    matches_pages: fromNullable(matches_pages)
  };
};

export const countAssets = async ({
  collection,
  satellite,
  filter
}: {
  collection: string;
  satellite: SatelliteContext;
  filter: ListParams;
}): Promise<bigint> => {
  // TODO
  const {count_assets} = await getSatelliteActor({satellite, options: {certified: false}});

  return count_assets(collection, toListParams(filter));
};

export const deleteAsset = async ({
  collection,
  fullPath,
  satellite
}: {
  collection: string;
  satellite: SatelliteContext;
} & Pick<AssetKey, 'fullPath'>): Promise<void> => {
  const actor = await getSatelliteActor({satellite, options: {certified: true}});

  return actor.del_asset(collection, fullPath);
};

export const deleteManyAssets = async ({
  assets,
  satellite
}: {
  assets: ({collection: string} & Pick<AssetKey, 'fullPath'>)[];
  satellite: SatelliteContext;
}): Promise<void> => {
  const {del_many_assets} = await getSatelliteActor({satellite, options: {certified: true}});

  const payload: [string, string][] = assets.map(({collection, fullPath}) => [
    collection,
    fullPath
  ]);

  await del_many_assets(payload);
};

export const deleteFilteredAssets = async ({
  collection,
  satellite,
  filter
}: {
  collection: string;
  satellite: SatelliteContext;
  filter: ListParams;
}): Promise<void> => {
  const {del_filtered_assets} = await getSatelliteActor({satellite, options: {certified: true}});

  return del_filtered_assets(collection, toListParams(filter));
};

export const getAsset = async ({
  collection,
  fullPath,
  satellite
}: {
  collection: string;
  satellite: SatelliteContext;
} & Pick<AssetKey, 'fullPath'>): Promise<AssetNoContent | undefined> => {
  // TODO
  const {get_asset} = await getSatelliteActor({satellite, options: {certified: false}});
  return fromNullable(await get_asset(collection, fullPath));
};

export const getManyAssets = async ({
  assets,
  satellite
}: {
  assets: ({collection: string} & Pick<AssetKey, 'fullPath'>)[];
  satellite: SatelliteContext;
}): Promise<(AssetNoContent | undefined)[]> => {
  // TODO
  const {get_many_assets} = await getSatelliteActor({satellite, options: {certified: false}});

  const payload: [string, string][] = assets.map(({collection, fullPath}) => [
    collection,
    fullPath
  ]);

  const resultsAssets = await get_many_assets(payload);

  return resultsAssets.map(([_, resultAsset]) => fromNullable(resultAsset));
};
