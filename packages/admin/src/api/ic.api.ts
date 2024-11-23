import {CanisterStatus} from '@dfinity/agent';
import {
  type chunk_hash,
  type InstallChunkedCodeParams,
  type UploadChunkParams,
  ICManagementCanister,
  InstallCodeParams
} from '@dfinity/ic-management';
import {Principal} from '@dfinity/principal';
import {assertNonNullish} from '@junobuild/utils';
import type {ActorParameters} from '../types/actor.types';
import {initAgent} from '../utils/actor.utils';

export const installCode = async ({
  actor,
  code
}: {
  actor: ActorParameters;
  code: InstallCodeParams;
}): Promise<void> => {
  const agent = await initAgent(actor);

  const {installCode} = ICManagementCanister.create({
    agent
  });

  return installCode(code);
};

export const storedChunks = async ({
  actor,
  canisterId
}: {
  actor: ActorParameters;
  canisterId: Principal;
}): Promise<chunk_hash[]> => {
  const agent = await initAgent(actor);

  const {storedChunks} = ICManagementCanister.create({
    agent
  });

  return storedChunks({canisterId});
};

export const clearChunkStore = async ({
  actor,
  canisterId
}: {
  actor: ActorParameters;
  canisterId: Principal;
}): Promise<void> => {
  const agent = await initAgent(actor);

  const {clearChunkStore} = ICManagementCanister.create({
    agent
  });

  return clearChunkStore({canisterId});
};

export const uploadChunk = async ({
  actor,
  chunk
}: {
  actor: ActorParameters;
  chunk: UploadChunkParams;
}): Promise<chunk_hash> => {
  const agent = await initAgent(actor);

  const {uploadChunk} = ICManagementCanister.create({
    agent
  });

  return uploadChunk(chunk);
};

export const installChunkedCode = async ({
  actor,
  code
}: {
  actor: ActorParameters;
  code: InstallChunkedCodeParams;
}): Promise<void> => {
  const agent = await initAgent(actor);

  const {installChunkedCode} = ICManagementCanister.create({
    agent
  });

  return installChunkedCode(code);
};

export const canisterMetadata = async ({
  canisterId,
  path,
  ...rest
}: ActorParameters & {
  canisterId: string | undefined;
  path: string;
}): Promise<CanisterStatus.Status | undefined> => {
  assertNonNullish(canisterId, 'A canister ID must be provided to request its status.');

  const agent = await initAgent(rest);

  const result = await CanisterStatus.request({
    canisterId: Principal.from(canisterId),
    agent,
    paths: [
      {
        kind: 'metadata',
        key: path,
        path,
        decodeStrategy: 'utf-8'
      }
    ]
  });

  return result.get(path);
};
