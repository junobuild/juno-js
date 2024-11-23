import type {chunk_hash} from '@dfinity/ic-management';
import {isNullish, nonNullish} from '@junobuild/utils';
import {
  clearChunkStore,
  installChunkedCode,
  storedChunks as storedChunksApi,
  uploadChunk as uploadChunkApi
} from '../api/ic.api';
import {INSTALL_MAX_CHUNK_SIZE} from '../constants/upgrade.constants';
import {UpgradeCodeParams} from '../types/upgrade.types';
import {uint8ArrayToHexString} from '../utils/array.utils';
import {blobSha256, uint8ArraySha256} from '../utils/crypto.utils';

interface UploadChunkOrderId {
  orderId: number;
}

interface UploadChunkParams extends UploadChunkOrderId {
  chunk: Blob;
  sha256: string;
}

interface UploadChunkResult extends UploadChunkOrderId {
  chunkHash: chunk_hash;
}

export const upgradeChunkedCode = async ({
  actor,
  canisterId,
  missionControlId,
  wasmModule,
  preClearChunks: userPreClearChunks,
  ...rest
}: UpgradeCodeParams) => {
  console.log('--------------------> userPreClearChunks:', userPreClearChunks);

  // If the user want to clear - reset - any chunks that have been uploaded before we start by removing those.
  if (userPreClearChunks) {
    await clearChunkStore({actor, canisterId});
  }

  const wasmChunks = await wasmToChunks({wasmModule});

  const {uploadChunks, storedChunks, preClearChunks, postClearChunks} = await prepareUpload({
    actor,
    wasmChunks,
    canisterId,
    missionControlId
  });

  console.log(
    '---------------WHAT',
    uploadChunks.length,
    storedChunks.length,
    preClearChunks,
    postClearChunks
  );

  // Alright, let's start by clearing existing chunks if there are already stored chunks but, none are matching those we want to upload.
  if (preClearChunks) {
    await clearChunkStore({actor, canisterId});
  }

  // Upload chunks to the IC in batch - i.e. 12 chunks uploaded at a time.
  let chunkIds: UploadChunkResult[] = [];
  for await (const results of batchUploadChunks({
    uploadChunks,
    actor,
    canisterId,
    missionControlId
  })) {
    chunkIds = [...chunkIds, ...results];
  }

  console.log('-----> installChunkedCode', {
    targetCanisterId: canisterId?.toText(),
    storeCanisterId: missionControlId?.toText()
  });

  // Install the chunked code.
  // ⚠️ The order of the chunks is really important! ⚠️
  await installChunkedCode({
    actor,
    code: {
      ...rest,
      chunkHashesList: [...chunkIds, ...storedChunks]
        .sort(({orderId: orderIdA}, {orderId: orderIdB}) => orderIdA - orderIdB)
        .map(({chunkHash}) => chunkHash),
      targetCanisterId: canisterId,
      storeCanisterId: missionControlId,
      wasmModuleHash: await uint8ArraySha256(wasmModule)
    }
  });

  // Finally let's clear only if no mission control is provided, as the chunks might be reused in that case.
  if (postClearChunks) {
    await clearChunkStore({actor, canisterId});
  }
};

const wasmToChunks = async ({
  wasmModule
}: Pick<UpgradeCodeParams, 'wasmModule'>): Promise<UploadChunkParams[]> => {
  const blob = new Blob([wasmModule]);

  const uploadChunks: UploadChunkParams[] = [];

  const chunkSize = INSTALL_MAX_CHUNK_SIZE;

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
  storedChunks: UploadChunkResult[];
  preClearChunks: boolean;
  postClearChunks: boolean;
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
  canisterId,
  missionControlId,
  actor,
  wasmChunks
}: Pick<UpgradeCodeParams, 'canisterId' | 'missionControlId' | 'actor'> & {
  wasmChunks: UploadChunkParams[];
}): Promise<PrepareUpload> => {
  console.log('-----> storedChunksApi', {
    targetCanisterId: canisterId?.toText(),
    storeCanisterId: missionControlId?.toText()
  });

  const stored = await storedChunksApi({
    actor,
    canisterId: missionControlId ?? canisterId
  });

  // We convert existing hash to extend with an easily comparable sha256 as hex value
  const existingStoredChunks: (Pick<UploadChunkResult, 'chunkHash'> &
    Pick<UploadChunkParams, 'sha256'>)[] = stored.map(({hash}) => ({
    chunkHash: {hash},
    sha256: uint8ArrayToHexString(hash)
  }));

  const {storedChunks, uploadChunks} = wasmChunks.reduce<
    Omit<PrepareUpload, 'preClearChunks' | 'postClearChunks'>
  >(
    ({uploadChunks, storedChunks}, {sha256, ...rest}) => {
      const existingStoredChunk = existingStoredChunks.find(
        ({sha256: storedSha256}) => storedSha256 === sha256
      );

      return {
        uploadChunks: [
          ...uploadChunks,
          ...(nonNullish(existingStoredChunk) ? [] : [{sha256, ...rest}])
        ],
        storedChunks: [
          ...storedChunks,
          ...(nonNullish(existingStoredChunk) ? [{...rest, ...existingStoredChunk}] : [])
        ]
      };
    },
    {
      uploadChunks: [],
      storedChunks: []
    }
  );

  return {
    uploadChunks,
    storedChunks,
    preClearChunks: stored.length > 0 && storedChunks.length === 0,
    postClearChunks: isNullish(missionControlId)
  };
};

async function* batchUploadChunks({
  uploadChunks,
  limit = 12,
  ...rest
}: Pick<UpgradeCodeParams, 'actor' | 'canisterId' | 'missionControlId'> & {
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
  missionControlId,
  uploadChunk: {chunk, ...rest}
}: Pick<UpgradeCodeParams, 'actor' | 'canisterId' | 'missionControlId'> & {
  uploadChunk: UploadChunkParams;
}): Promise<UploadChunkResult> => {
  console.log(
    '-----> uploadChunkApi',
    missionControlId ?? canisterId,
    missionControlId,
    canisterId
  );

  const chunkHash = await uploadChunkApi({
    actor,
    chunk: {
      canisterId: missionControlId ?? canisterId,
      chunk: new Uint8Array(await chunk.arrayBuffer())
    }
  });

  return {
    chunkHash: chunkHash,
    ...rest
  };
};
