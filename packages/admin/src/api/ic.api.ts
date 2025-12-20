import {
  type CanisterStatusResponse,
  IcManagementCanister,
  type IcManagementDid,
  type InstallChunkedCodeParams,
  type InstallCodeParams,
  type UploadChunkParams
} from '@icp-sdk/canisters/ic-management';
import {CanisterStatus} from '@icp-sdk/core/agent';
import {Principal} from '@icp-sdk/core/principal';
import {type ActorParameters, useOrInitAgent} from '@junobuild/ic-client/actor';

export const canisterStop = async ({
  canisterId,
  actor
}: {
  canisterId: Principal;
  actor: ActorParameters;
}): Promise<void> => {
  const agent = await useOrInitAgent(actor);

  const {stopCanister} = IcManagementCanister.create({
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

  const {startCanister} = IcManagementCanister.create({
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

  const {installCode} = IcManagementCanister.create({
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
}): Promise<IcManagementDid.chunk_hash[]> => {
  const agent = await useOrInitAgent(actor);

  const {storedChunks} = IcManagementCanister.create({
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

  const {clearChunkStore} = IcManagementCanister.create({
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
}): Promise<IcManagementDid.chunk_hash> => {
  const agent = await useOrInitAgent(actor);

  const {uploadChunk} = IcManagementCanister.create({
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

  const {installChunkedCode} = IcManagementCanister.create({
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

  const {canisterStatus} = IcManagementCanister.create({
    agent
  });

  return canisterStatus({canisterId});
};

export const canisterMetadata = async ({
  canisterId,
  path,
  ...rest
}: ActorParameters & {
  canisterId: Principal | string;
  path: string;
}): Promise<CanisterStatus.Status | undefined> => {
  const agent = await useOrInitAgent(rest);

  // TODO: Workaround for agent-js. Disable console.warn.
  // See https://github.com/dfinity/agent-js/issues/843
  const hideAgentJsConsoleWarn = globalThis.console.warn;
  globalThis.console.warn = (): null => null;

  const result = await CanisterStatus.request({
    canisterId: canisterId instanceof Principal ? canisterId : Principal.from(canisterId),
    agent,
    paths: [
      {
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
}): Promise<IcManagementDid.list_canister_snapshots_result> => {
  const agent = await useOrInitAgent(actor);

  const {listCanisterSnapshots} = IcManagementCanister.create({
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
  snapshotId?: IcManagementDid.snapshot_id;
}): Promise<IcManagementDid.take_canister_snapshot_result> => {
  const agent = await useOrInitAgent(actor);

  const {takeCanisterSnapshot} = IcManagementCanister.create({
    agent
  });

  return takeCanisterSnapshot(rest);
};
