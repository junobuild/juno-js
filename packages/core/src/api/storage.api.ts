import type {
  AssetNoContent,
  ListResults as ListAssetsApi,
  _SERVICE as SatelliteActor
} from '../../declarations/satellite/satellite.did';
import type {ListParams, ListResults} from '../types/list.types';
import type {Satellite} from '../types/satellite.types';
import type {Asset, ENCODING_TYPE, Storage} from '../types/storage.types';
import {toNullable} from '../utils/did.utils';
import {isBrowser} from '../utils/env.utils';
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
  satellite
}: Required<Omit<Storage, 'token' | 'encoding'>> &
  Pick<Storage, 'token' | 'encoding'> & {satellite: Satellite}): Promise<void> => {
  const logFileInfo = `${filename}${encoding ? ` (${encoding})` : ''}`;

  const actor: SatelliteActor = await getSatelliteActor(satellite);

  const {batch_id: batchId} = await actor.init_asset_upload({
    collection,
    full_path: fullPath,
    name: filename,
    token: toNullable<string>(token),
    encoding_type: toNullable<ENCODING_TYPE>(encoding)
  });

  const chunkSize = 700000;

  const chunkIds: {chunk_id: bigint}[] = [];

  // Prevent transforming chunk to arrayBuffer error: The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.
  const clone: Blob = isBrowser() ? new Blob([await data.arrayBuffer()]) : data;

  for (let start = 0; start < clone.size; start += chunkSize) {
    const chunk: Blob = clone.slice(start, start + chunkSize);

    chunkIds.push(
      await uploadChunk({
        batchId,
        chunk,
        actor
      })
    );
  }

  const contentType: [[string, string]] | undefined =
    headers.find(([type, _]) => type.toLowerCase() === 'content-type') === undefined &&
    data.type !== undefined &&
    data.type !== ''
      ? [['Content-Type', data.type]]
      : undefined;

  await actor.commit_asset_upload({
    batch_id: batchId,
    chunk_ids: chunkIds.map(({chunk_id}: {chunk_id: bigint}) => chunk_id),
    headers: [...headers, ...(contentType ? contentType : [])]
  });
};

const uploadChunk = async ({
  batchId,
  chunk,
  actor
}: {
  batchId: bigint;
  chunk: Blob;
  actor: SatelliteActor;
}): Promise<{chunk_id: bigint}> =>
  actor.upload_asset_chunk({
    batch_id: batchId,
    content: new Uint8Array(await chunk.arrayBuffer())
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
    matches_length,
    length
  }: ListAssetsApi = await actor.list_assets(toNullable<string>(collection), toListParams(filter));

  return {
    items: assets.map(([_, asset]) => asset),
    length,
    matches_length
  };
};

export const deleteAsset = async ({
  collection,
  storageFile,
  satellite
}: {
  collection: string;
  storageFile: Asset;
  satellite: Satellite;
}): Promise<void> => {
  const actor: SatelliteActor = await getSatelliteActor(satellite);

  const {fullPath} = storageFile;

  return actor.del_asset(collection, fullPath);
};

export const deleteAssets = async ({
  collection,
  satellite
}: {
  collection?: string;
  satellite: Satellite;
}): Promise<void> => {
  const actor: SatelliteActor = await getSatelliteActor(satellite);

  return actor.del_assets(toNullable(collection));
};
