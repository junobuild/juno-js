import {toNullable} from '@dfinity/utils';
import {isBrowser} from '@junobuild/utils';
import type {
  ConsoleCommitBatch,
  ConsoleInitAssetKey,
  ConsoleUploadChunk,
  SatelliteCommitBatch,
  SatelliteInitAssetKey,
  SatelliteUploadChunk
} from '../api/actor.factory';
import type {EncodingType} from '../types/storage';
import type {UploadAsset, UploadAssetActor, UploadAssetWithProposalActor} from '../types/upload';
import {UPLOAD_CHUNK_SIZE} from '../constants/upload.constants';

type InitAssetKey = SatelliteInitAssetKey | ConsoleInitAssetKey;
type UploadChunk = SatelliteUploadChunk | ConsoleUploadChunk;
type CommitBatch = SatelliteCommitBatch | ConsoleCommitBatch;

export const uploadAsset = async ({
  asset: {data, headers, ...restAsset},
  actor
}: {
  asset: UploadAsset;
  actor: UploadAssetActor;
}): Promise<void> => {
  const {init_asset_upload, upload_asset_chunk, commit_asset_upload} = actor;

  const {batch_id: batchId} = await init_asset_upload(mapInitAssetUploadParams(restAsset));

  const {chunkIds} = await uploadChunks({data, uploadFn: upload_asset_chunk, batchId});

  await commitAsset({
    commitFn: commit_asset_upload,
    batchId,
    data,
    headers,
    chunkIds
  });
};

export const uploadAssetWithProposal = async ({
  asset: {data, headers, ...restAsset},
  proposalId,
  actor
}: {
  asset: UploadAsset;
  proposalId: bigint;
  actor: UploadAssetWithProposalActor;
}): Promise<void> => {
  const {init_proposal_asset_upload, upload_proposal_asset_chunk, commit_proposal_asset_upload} =
    actor;

  const {batch_id: batchId} = await init_proposal_asset_upload(
    mapInitAssetUploadParams(restAsset),
    proposalId
  );

  const {chunkIds} = await uploadChunks({data, uploadFn: upload_proposal_asset_chunk, batchId});

  await commitAsset({
    commitFn: commit_proposal_asset_upload,
    batchId,
    data,
    headers,
    chunkIds
  });
};

const mapInitAssetUploadParams = ({
  filename,
  collection,
  token,
  fullPath,
  encoding,
  description
}: Omit<UploadAsset, 'headers' | 'data'>): InitAssetKey => ({
  collection,
  full_path: fullPath,
  name: filename,
  token: toNullable<string>(token),
  encoding_type: toNullable<EncodingType>(encoding),
  description: toNullable(description)
});

const commitAsset = async ({
  commitFn,
  batchId,
  chunkIds,
  headers,
  data
}: {
  commitFn: (commitBatch: CommitBatch) => Promise<void>;
  batchId: bigint;
  chunkIds: UploadChunkResult[];
} & Pick<UploadAsset, 'headers' | 'data'>) => {
  const contentType: [[string, string]] | undefined =
    headers.find(([type, _]) => type.toLowerCase() === 'content-type') === undefined &&
    data.type !== undefined &&
    data.type !== ''
      ? [['Content-Type', data.type]]
      : undefined;

  await commitFn({
    batch_id: batchId,
    chunk_ids: chunkIds.map(({chunk_id}: UploadChunkResult) => chunk_id),
    headers: [...headers, ...(contentType ?? [])]
  });
};

const uploadChunks = async ({
  data,
  uploadFn,
  batchId
}: {
  batchId: bigint;
} & Pick<UploadAsset, 'data'> &
  Pick<UploadChunkParams, 'uploadFn'>): Promise<{chunkIds: UploadChunkResult[]}> => {
  const uploadChunks: UploadChunkParams[] = [];

  // Prevent transforming chunk to arrayBuffer error: The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.
  const clone: Blob = isBrowser() ? new Blob([await data.arrayBuffer()]) : data;

  // Split data into chunks
  let orderId = 0n;
  for (let start = 0; start < clone.size; start += UPLOAD_CHUNK_SIZE) {
    const chunk: Blob = clone.slice(start, start + UPLOAD_CHUNK_SIZE);

    uploadChunks.push({
      batchId,
      chunk,
      uploadFn,
      orderId
    });

    orderId++;
  }

  // Upload chunks to the IC in batch - i.e. 12 chunks uploaded at a time.
  let chunkIds: UploadChunkResult[] = [];
  for await (const results of batchUploadChunks({uploadChunks})) {
    chunkIds = [...chunkIds, ...results];
  }

  return {chunkIds};
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

interface UploadChunkResult {
  chunk_id: bigint;
}

interface UploadChunkParams {
  batchId: bigint;
  chunk: Blob;
  uploadFn: (uploadChunk: UploadChunk) => Promise<UploadChunkResult>;
  orderId: bigint;
}

const uploadChunk = async ({
  batchId,
  chunk,
  uploadFn,
  orderId
}: UploadChunkParams): Promise<UploadChunkResult> =>
  uploadFn({
    batch_id: batchId,
    content: new Uint8Array(await chunk.arrayBuffer()),
    order_id: toNullable(orderId)
  });
