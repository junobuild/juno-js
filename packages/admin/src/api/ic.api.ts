import {CanisterStatus} from '@dfinity/agent';
import {
  type InstallCodeParams,
  type list_canister_snapshots_result,
  type snapshot_id
,
  type chunk_hash,
  type InstallChunkedCodeParams,
  type UploadChunkParams,
  ICManagementCanister
} from '@dfinity/ic-management';
import type {take_canister_snapshot_result} from '@dfinity/ic-management/dist/candid/ic-management';
import type {CanisterStatusResponse} from '@dfinity/ic-management/dist/types/types/ic-management.responses';
import {Principal} from '@dfinity/principal';
import {assertNonNullish} from '@dfinity/utils';
import type {ActorParameters} from '../types/actor.types';
import {useOrInitAgent} from '../utils/actor.utils';

export const canisterStop = async ({
  canisterId,
  actor
}: {
  canisterId: Principal;
  actor: ActorParameters;
}): Promise<void> => {
  const agent = await useOrInitAgent(actor);

  const {stopCanister} = ICManagementCanister.create({
    agent
  });

  await stopCanister(canisterId);
};

export const canisterStart = async ({
  canisterId,
  actor
}: {
  canisterId: Principal;
  actor: ActorParameters;
}): Promise<void> => {
  const agent = await useOrInitAgent(actor);

  const {startCanister} = ICManagementCanister.create({
    agent
  });

  await startCanister(canisterId);
};

export const installCode = async ({
  actor,
  code
}: {
  actor: ActorParameters;
  code: InstallCodeParams;
}): Promise<void> => {
  const agent = await useOrInitAgent(actor);

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
  const agent = await useOrInitAgent(actor);

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
  const agent = await useOrInitAgent(actor);

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
  const agent = await useOrInitAgent(actor);

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
  const agent = await useOrInitAgent(actor);

  const {installChunkedCode} = ICManagementCanister.create({
    agent
  });

  return installChunkedCode(code);
};

export const canisterStatus = async ({
  actor,
  canisterId
}: {
  actor: ActorParameters;
  canisterId: Principal;
}): Promise<CanisterStatusResponse> => {
  const agent = await useOrInitAgent(actor);

  const {canisterStatus} = ICManagementCanister.create({
    agent
  });

  return canisterStatus(canisterId);
};

export const canisterMetadata = async ({
  canisterId,
  path,
  ...rest
}: ActorParameters & {
  canisterId: Principal | string | undefined;
  path: string;
}): Promise<CanisterStatus.Status | undefined> => {
  assertNonNullish(canisterId, 'A canister ID must be provided to request its status.');

  const agent = await useOrInitAgent(rest);

  // TODO: Workaround for agent-js. Disable console.warn.
  // See https://github.com/dfinity/agent-js/issues/843
  const hideAgentJsConsoleWarn = globalThis.console.warn;
  globalThis.console.warn = (): null => null;

  const result = await CanisterStatus.request({
    canisterId: canisterId instanceof Principal ? canisterId : Principal.fromText(canisterId),
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

  // Redo console.warn
  globalThis.console.warn = hideAgentJsConsoleWarn;

  return result.get(path);
};

export const listCanisterSnapshots = async ({
  actor,
  canisterId
}: {
  actor: ActorParameters;
  canisterId: Principal;
}): Promise<list_canister_snapshots_result> => {
  const agent = await useOrInitAgent(actor);

  const {listCanisterSnapshots} = ICManagementCanister.create({
    agent
  });

  return listCanisterSnapshots({canisterId});
};

export const takeCanisterSnapshot = async ({
  actor,
  ...rest
}: {
  actor: ActorParameters;
  canisterId: Principal;
  snapshotId?: snapshot_id;
}): Promise<take_canister_snapshot_result> => {
  const agent = await useOrInitAgent(actor);

  const {takeCanisterSnapshot} = ICManagementCanister.create({
    agent
  });

  return takeCanisterSnapshot(rest);
};
