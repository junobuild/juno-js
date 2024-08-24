import type {UploadAsset} from '@junobuild/storage';
import {uploadAsset as uploadAssetStorage, type AssetKey} from '@junobuild/storage';
import {fromNullable} from '@junobuild/utils';
import type {
  AssetNoContent,
  InitAssetKey,
  InitUploadResult,
  _SERVICE as SatelliteActor
} from '../../declarations/satellite/satellite.did';
import type {ListParams, ListResults} from '../types/list.types';
import type {Satellite} from '../types/satellite.types';
import {toListParams} from '../utils/list.utils';
import {getSatelliteActor} from './actor.api';

export const uploadAsset = async ({
  satellite,
  ...asset
}: UploadAsset & {satellite: Satellite}): Promise<void> => {
  const actor = await getSatelliteActor(satellite);

  const init_asset_upload = async (initAssetKey: InitAssetKey): Promise<InitUploadResult> => {
    return await actor.init_asset_upload(initAssetKey);
  };

  await uploadAssetStorage({
    actor,
    asset,
    init_asset_upload
  });
};

export const listAssets = async ({
  collection,
  satellite,
  filter
}: {
  collection: string;
  satellite: Satellite;
  filter: ListParams;
}): Promise<ListResults<AssetNoContent>> => {
  const {list_assets} = await getSatelliteActor(satellite);

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
  satellite: Satellite;
  filter: ListParams;
}): Promise<bigint> => {
  const {count_assets} = await getSatelliteActor(satellite);

  return count_assets(collection, toListParams(filter));
};

export const deleteAsset = async ({
  collection,
  fullPath,
  satellite
}: {
  collection: string;
  satellite: Satellite;
} & Pick<AssetKey, 'fullPath'>): Promise<void> => {
  const actor: SatelliteActor = await getSatelliteActor(satellite);

  return actor.del_asset(collection, fullPath);
};

export const deleteManyAssets = async ({
  assets,
  satellite
}: {
  assets: ({collection: string} & Pick<AssetKey, 'fullPath'>)[];
  satellite: Satellite;
}): Promise<void> => {
  const {del_many_assets} = await getSatelliteActor(satellite);

  const payload: [string, string][] = assets.map(({collection, fullPath}) => [
    collection,
    fullPath
  ]);

  await del_many_assets(payload);
};

export const getAsset = async ({
  collection,
  fullPath,
  satellite
}: {
  collection: string;
  satellite: Satellite;
} & Pick<AssetKey, 'fullPath'>): Promise<AssetNoContent | undefined> => {
  const {get_asset} = await getSatelliteActor(satellite);
  return fromNullable(await get_asset(collection, fullPath));
};

export const getManyAssets = async ({
  assets,
  satellite
}: {
  assets: ({collection: string} & Pick<AssetKey, 'fullPath'>)[];
  satellite: Satellite;
}): Promise<(AssetNoContent | undefined)[]> => {
  const {get_many_assets} = await getSatelliteActor(satellite);

  const payload: [string, string][] = assets.map(({collection, fullPath}) => [
    collection,
    fullPath
  ]);

  const resultsAssets = await get_many_assets(payload);

  return resultsAssets.map(([_, resultAsset]) => fromNullable(resultAsset));
};
