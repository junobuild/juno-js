import type {chunk_hash} from '@dfinity/ic-management';
import {Principal} from '@dfinity/principal';
import {nonNullish} from '@junobuild/utils';
import {storedChunks} from '../api/ic.api';
import {ActorParameters} from '../types/actor.types';
import {blobSha256, uint8ArraySha256} from '../utils/crypto.utils';

interface UploadChunkOrderId {
  orderId: bigint;
}

interface UploadChunkParams extends UploadChunkOrderId {
  chunk: Blob;
  sha256: string;
}

interface UploadChunkResult extends UploadChunkOrderId {
  hash: chunk_hash;
}

export type UpgradeCodeParams = {
  actor: ActorParameters;
  missionControlId?: Principal;
  canisterId: Principal;
  wasmModule: Uint8Array;
  arg: Uint8Array;
};

export const upgradeCode = async ({
  actor,
  canisterId,
  missionControlId,
  wasmModule
}: UpgradeCodeParams) => {
  const wasmChunks = await wasmToChunks({wasmModule});

  const {uploadChunks, storedChunks} = await filterChunksToUpload({
    actor,
    wasmChunks,
    missionControlId
  });

  // TODO: maybe clean chunked stores

  // Upload chunks to the IC in batch - i.e. 12 chunks uploaded at a time.
  let chunkIds: UploadChunkResult[] = [];
  for await (const results of batchUploadChunks({uploadChunks})) {
    chunkIds = [...chunkIds, ...results];
  }

  // TODO: install chunked code

  // TODO: maybe clean chunked stores
};

const wasmToChunks = async ({
  wasmModule
}: Pick<UpgradeCodeParams, 'wasmModule'>): Promise<UploadChunkParams[]> => {
  const blob = new Blob([wasmModule]);

  const uploadChunks: UploadChunkParams[] = [];

  const chunkSize = 1000000;

  // Split data into chunks
  let orderId = 0n;
  for (let start = 0; start < blob.size; start += chunkSize) {
    const chunk = blob.slice(start, start + chunkSize);
    uploadChunks.push({
      chunk,
      orderId,
      sha256: await blobSha256(chunk)
    });

    orderId++;
  }

  return uploadChunks;
};

type FilterChunksToUpload = {
  uploadChunks: UploadChunkParams[];
  storedChunks: UploadChunkParams[];
};

const filterChunksToUpload = async ({
  missionControlId,
  actor,
  wasmChunks
}: Pick<UpgradeCodeParams, 'missionControlId' | 'actor'> & {
  wasmChunks: UploadChunkParams[];
}): Promise<FilterChunksToUpload> => {
  const stored = nonNullish(missionControlId)
    ? await storedChunks({
        actor,
        canisterId: missionControlId
      })
    : [];

  // We convert existing hash to an easily comparable sha256 - i.e. string
  const promises = stored.map(({hash}) =>
    uint8ArraySha256(hash instanceof Uint8Array ? hash : new Uint8Array(hash))
  );
  const storedHashes = await Promise.all(promises);

  return wasmChunks.reduce<FilterChunksToUpload>(
    ({uploadChunks, storedChunks}, {sha256, ...rest}) => ({
      uploadChunks: [
        ...uploadChunks,
        ...(storedHashes.includes(sha256) ? [] : [{sha256, ...rest}])
      ],
      storedChunks: [...storedChunks, ...(storedHashes.includes(sha256) ? [{sha256, ...rest}] : [])]
    }),
    {
      uploadChunks: [],
      storedChunks: []
    }
  );
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
