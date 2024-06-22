import {isBrowser, toNullable} from '@junobuild/utils';
import type {_SERVICE as SatelliteActor} from '../../declarations/satellite/satellite.did';
import type {ENCODING_TYPE, Storage} from '../types/storage.types';

export type UploadAsset = Required<Omit<Storage, 'token' | 'encoding' | 'description'>> &
  Pick<Storage, 'token' | 'encoding' | 'description'>;

export const uploadAsset = async ({
  asset: {data, filename, collection, headers, token, fullPath, encoding, description},
  actor
}: {
  asset: UploadAsset;
  actor: SatelliteActor;
}): Promise<void> => {
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
