import {fromNullable, isBrowser, toNullable} from '@junobuild/utils';
import type {
  AssetNoContent,
  ListResults as ListAssetsApi,
  _SERVICE as SatelliteActor
} from '../../declarations/satellite/satellite.did';
import type {ListParams, ListResults} from '../types/list.types';
import type {Satellite} from '../types/satellite.types';
import type {AssetKey, ENCODING_TYPE, Storage} from '../types/storage.types';
import {toListParams} from '../utils/list.utils';
import {getSatelliteActor} from './actor.api';

export const uploadAsset = async ({
  data,
  filename,
  collection,
  headers,
  token,
  fullPath,
  encoding,
  description,
  satellite
}: Required<Omit<Storage, 'token' | 'encoding' | 'description'>> &
  Pick<Storage, 'token' | 'encoding' | 'description'> & {satellite: Satellite}): Promise<void> => {
  const actor: SatelliteActor = await getSatelliteActor(satellite);

  const {batch_id: batchId} = await actor.init_asset_upload({
    collection,
    full_path: fullPath,
    name: filename,
    token: toNullable<string>(token),
    encoding_type: toNullable<ENCODING_TYPE>(encoding),
    description: toNullable(description)
  });

  // https://forum.dfinity.org/t/optimal-upload-chunk-size/20444/23?u=peterparker
  const chunkSize = 1900000;

  const uploadChunks: UploadChunkParams[] = [];

  // Prevent transforming chunk to arrayBuffer error: The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.
  const clone: Blob = isBrowser() ? new Blob([await data.arrayBuffer()]) : data;

  // Split data into chunks
  let orderId = 0n;
  for (let start = 0; start < clone.size; start += chunkSize) {
    const chunk: Blob = clone.slice(start, start + chunkSize);

    uploadChunks.push({
      batchId,
      chunk,
      actor,
      orderId
    });

    orderId++;
  }

  // Upload chunks to the IC in batch - i.e. 12 chunks uploaded at a time.
  let chunkIds: UploadChunkResult[] = [];
  for await (const results of batchUploadChunks({uploadChunks})) {
    chunkIds = [...chunkIds, ...results];
  }

  const contentType: [[string, string]] | undefined =
    headers.find(([type, _]) => type.toLowerCase() === 'content-type') === undefined &&
    data.type !== undefined &&
    data.type !== ''
      ? [['Content-Type', data.type]]
      : undefined;

  await actor.commit_asset_upload({
    batch_id: batchId,
    chunk_ids: chunkIds.map(({chunk_id}: UploadChunkResult) => chunk_id),
    headers: [...headers, ...(contentType ? contentType : [])]
  });
};

async function* batchUploadChunks({
  uploadChunks,
  limit = 12
}: {
  uploadChunks: UploadChunkParams[];
  limit?: number;
}): AsyncGenerator<UploadChunkResult[], void> {
  for (let i = 0; i < uploadChunks.length; i = i + limit) {
    const batch = uploadChunks.slice(i, i + limit);
    const result = await Promise.all(batch.map((params) => uploadChunk(params)));
    yield result;
  }
}

type UploadChunkResult = {chunk_id: bigint};

type UploadChunkParams = {
  batchId: bigint;
  chunk: Blob;
  actor: SatelliteActor;
  orderId: bigint;
};

const uploadChunk = async ({
  batchId,
  chunk,
  actor,
  orderId
}: UploadChunkParams): Promise<UploadChunkResult> =>
  actor.upload_asset_chunk({
    batch_id: batchId,
    content: new Uint8Array(await chunk.arrayBuffer()),
    order_id: toNullable(orderId)
  });

export const listAssets = async ({
  collection,
  satellite,
  filter
}: {
  collection: string;
  satellite: Satellite;
  filter: ListParams;
}): Promise<ListResults<AssetNoContent>> => {
  const actor: SatelliteActor = await getSatelliteActor(satellite);

  const {
    items: assets,
    items_length,
    items_page,
    matches_length,
    matches_pages
  }: ListAssetsApi = await actor.list_assets(collection, toListParams(filter));

  return {
    items: assets.map(([_, asset]) => asset),
    items_length,
    items_page: fromNullable(items_page),
    matches_length,
    matches_pages: fromNullable(matches_pages)
  };
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
