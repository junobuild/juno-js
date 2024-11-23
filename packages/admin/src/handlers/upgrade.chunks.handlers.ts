import type {chunk_hash} from '@dfinity/ic-management';
import {isNullish, nonNullish} from '@junobuild/utils';
import {
  clearChunkStore,
  installChunkedCode,
  storedChunks,
  uploadChunk as uploadChunkApi
} from '../api/ic.api';
import {UpgradeCodeParams} from '../types/upgrade.types';
import {blobSha256, uint8ArraySha256} from '../utils/crypto.utils';

interface UploadChunkOrderId {
  orderId: number;
}

interface UploadChunkParams extends UploadChunkOrderId {
  chunk: Blob;
  sha256: string;
}

interface UploadChunkResult extends UploadChunkOrderId {
  hash: chunk_hash;
}

export const upgradeChunkedCode = async ({
  actor,
  canisterId,
  missionControlId,
  wasmModule,
  ...rest
}: UpgradeCodeParams) => {
  const wasmChunks = await wasmToChunks({wasmModule});

  const {uploadChunks, clearChunks} = await prepareUpload({
    actor,
    wasmChunks,
    missionControlId
  });

  // Alright, let's start by clearing existing chunks if necessary:
  // either when targeting a specific canister, or if a mission control is provided
  // and any new chunk differs from the existing ones.
  if (clearChunks) {
    await clearChunkStore({actor, canisterId});
  }

  // Upload chunks to the IC in batch - i.e. 12 chunks uploaded at a time.
  let chunkIds: UploadChunkResult[] = [];
  for await (const results of batchUploadChunks({uploadChunks, actor, canisterId})) {
    chunkIds = [...chunkIds, ...results];
  }

  // Install the chunked code.
  // ⚠️ The order of the chunks is really important! ⚠️
  await installChunkedCode({
    actor,
    code: {
      ...rest,
      chunkHashesList: chunkIds
        .sort(({orderId: orderIdA}, {orderId: orderIdB}) => orderIdA - orderIdB)
        .map(({hash}) => hash),
      targetCanisterId: canisterId,
      storeCanisterId: missionControlId,
      wasmModuleHash: wasmModule
    }
  });

  // TODO: catch errors
  // Post-processing and clearing only if no mission control is provided, as the chunks might be reused in that case.
  if (clearChunks && isNullish(missionControlId)) {
    await clearChunkStore({actor, canisterId});
  }
};

const wasmToChunks = async ({
  wasmModule
}: Pick<UpgradeCodeParams, 'wasmModule'>): Promise<UploadChunkParams[]> => {
  const blob = new Blob([wasmModule]);

  const uploadChunks: UploadChunkParams[] = [];

  const chunkSize = 1000000;

  // Split data into chunks
  let orderId = 0;
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

interface PrepareUpload {
  uploadChunks: UploadChunkParams[];
  storedChunks: UploadChunkParams[];
  clearChunks: boolean;
}

/**
 * Prepares the upload by comparing the provided WASM chunks with already stored chunks,
 * determining which chunks need to be uploaded and which are already stored.
 *
 * If a `missionControlId` is provided, the function fetches the already stored chunks
 * for the given mission control canister. If not provided, no stored chunks are fetched,
 * and all WASM chunks are treated as new.
 *
 * In other words:
 * - If chunks are uploaded for a specific canister, all existing chunks will be cleared,
 *   and the new chunks will be uploaded.
 * - If a mission control is used, only differences between the existing chunks and the
 *   new chunks are processed. This allows reusing the same chunks when developers update
 *   multiple satellites to the same version, optimizing the process. Note that if any differences
 *   are detected, all existing chunks will also be cleared.
 *
 * @async
 * @function
 * @param {Object} params - The parameters for preparing the upload.
 * @param {string | null} params.missionControlId - The ID of the mission control canister.
 * If null, no stored chunks are fetched, and all chunks are treated as new.
 * @param {ActorSubclass} params.actor - The actor to interact with the canister for fetching stored chunks.
 * @param {UploadChunkParams[]} params.wasmChunks - The WASM chunks to be checked and potentially uploaded.
 * @returns {Promise<PrepareUpload>} - An object containing details about chunks to upload, stored chunks,
 * and whether to clear stored chunks.
 */
const prepareUpload = async ({
  missionControlId,
  actor,
  wasmChunks
}: Pick<UpgradeCodeParams, 'missionControlId' | 'actor'> & {
  wasmChunks: UploadChunkParams[];
}): Promise<PrepareUpload> => {
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

  const {storedChunks: existingStoredChunks, ...rest} = wasmChunks.reduce<
    Omit<PrepareUpload, 'clearChunks'>
  >(
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

  return {
    ...rest,
    storedChunks: existingStoredChunks,
    clearChunks: existingStoredChunks.length > 0
  };
};

async function* batchUploadChunks({
  uploadChunks,
  limit = 12,
  ...rest
}: Pick<UpgradeCodeParams, 'actor' | 'canisterId'> & {
  uploadChunks: UploadChunkParams[];
  limit?: number;
}): AsyncGenerator<UploadChunkResult[], void> {
  for (let i = 0; i < uploadChunks.length; i = i + limit) {
    const batch = uploadChunks.slice(i, i + limit);
    const result = await Promise.all(
      batch.map((uploadChunkParams) =>
        uploadChunk({
          uploadChunk: uploadChunkParams,
          ...rest
        })
      )
    );
    yield result;
  }
}

const uploadChunk = async ({
  actor,
  canisterId,
  uploadChunk: {chunk, ...rest}
}: Pick<UpgradeCodeParams, 'actor' | 'canisterId'> & {
  uploadChunk: UploadChunkParams;
}): Promise<UploadChunkResult> => {
  const chunkHash = await uploadChunkApi({
    actor,
    chunk: {
      canisterId,
      chunk: new Uint8Array(await chunk.arrayBuffer())
    }
  });

  return {
    hash: chunkHash,
    ...rest
  };
};
