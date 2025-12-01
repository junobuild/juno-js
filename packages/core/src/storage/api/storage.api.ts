import {fromNullable, toNullable} from '@dfinity/utils';
import type {SatelliteDid} from '@junobuild/ic-client/actor';
import {
  uploadAsset as uploadAssetStorage,
  type AssetKey,
  type UploadAsset
} from '@junobuild/storage';
import {getSatelliteActor} from '../../core/api/actor.api';
import type {ActorReadParams, ActorUpdateParams} from '../../core/types/actor';
import type {ListParams, ListResults} from '../../core/types/list';
import {toListParams} from '../../core/utils/list.utils';

export const uploadAsset = async ({
  asset,
  ...rest
}: {asset: UploadAsset} & ActorUpdateParams): Promise<void> => {
  const actor = await getSatelliteActor(rest);

  await uploadAssetStorage({
    actor,
    asset
  });
};

export const listAssets = async ({
  collection,
  filter,
  ...rest
}: {
  collection: string;
  filter: ListParams;
} & ActorReadParams): Promise<ListResults<SatelliteDid.AssetNoContent>> => {
  const {list_assets} = await getSatelliteActor(rest);

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
  filter,
  ...rest
}: {
  collection: string;
  filter: ListParams;
} & ActorReadParams): Promise<bigint> => {
  const {count_assets} = await getSatelliteActor(rest);

  return count_assets(collection, toListParams(filter));
};

export const deleteAsset = async ({
  collection,
  fullPath,
  ...rest
}: {
  collection: string;
} & ActorUpdateParams &
  Pick<AssetKey, 'fullPath'>): Promise<void> => {
  const actor = await getSatelliteActor(rest);

  return actor.del_asset(collection, fullPath);
};

export const deleteManyAssets = async ({
  assets,
  satellite
}: {
  assets: ({collection: string} & Pick<AssetKey, 'fullPath'>)[];
} & ActorUpdateParams): Promise<void> => {
  const {del_many_assets} = await getSatelliteActor({satellite, options: {certified: true}});

  const payload: [string, string][] = assets.map(({collection, fullPath}) => [
    collection,
    fullPath
  ]);

  await del_many_assets(payload);
};

export const deleteFilteredAssets = async ({
  collection,
  filter,
  ...rest
}: {
  collection: string;
  filter: ListParams;
} & ActorUpdateParams): Promise<void> => {
  const {del_filtered_assets} = await getSatelliteActor(rest);

  return del_filtered_assets(collection, toListParams(filter));
};

export const setAssetToken = async ({
  collection,
  fullPath,
  token,
  ...rest
}: {
  collection: string;
  token: string | null;
} & ActorUpdateParams &
  Pick<AssetKey, 'fullPath'>): Promise<void> => {
  const {set_asset_token} = await getSatelliteActor(rest);

  return set_asset_token(collection, fullPath, toNullable(token));
};

export const getAsset = async ({
  collection,
  fullPath,
  ...rest
}: {
  collection: string;
} & ActorReadParams &
  Pick<AssetKey, 'fullPath'>): Promise<SatelliteDid.AssetNoContent | undefined> => {
  const {get_asset} = await getSatelliteActor(rest);
  return fromNullable(await get_asset(collection, fullPath));
};

export const getManyAssets = async ({
  assets,
  ...rest
}: {
  assets: ({collection: string} & Pick<AssetKey, 'fullPath'>)[];
} & ActorReadParams): Promise<(SatelliteDid.AssetNoContent | undefined)[]> => {
  const {get_many_assets} = await getSatelliteActor(rest);

  const payload: [string, string][] = assets.map(({collection, fullPath}) => [
    collection,
    fullPath
  ]);

  const resultsAssets = await get_many_assets(payload);

  return resultsAssets.map(([_, resultAsset]) => fromNullable(resultAsset));
};
