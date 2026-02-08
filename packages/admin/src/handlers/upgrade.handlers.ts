import {fromNullable, isNullish, uint8ArrayToHexString} from '@dfinity/utils';
import {
  canisterStart,
  canisterStatus,
  canisterStop,
  listCanisterSnapshots,
  takeCanisterSnapshot
} from '../api/ic.api';
import {SIMPLE_INSTALL_MAX_WASM_SIZE} from '../constants/upgrade.constants';
import {UpgradeCodeUnchangedError} from '../errors/upgrade.errors';
import {uint8ArraySha256} from '../helpers/crypto.helpers';
import {type UpgradeCodeParams, UpgradeCodeProgressStep} from '../types/upgrade';
import {upgradeChunkedCode} from './upgrade.chunks.handlers';
import {upgradeSingleChunkCode} from './upgrade.single.handlers';

export const upgrade = async ({
  wasmModule,
  canisterId,
  actor,
  onProgress,
  takeSnapshot = true,
  ...rest
}: UpgradeCodeParams & {reset?: boolean}) => {
  // 1. We verify that the code to be installed is different from the code already deployed. If the codes are identical, we skip the installation.
  // TODO: unless mode is reinstall
  const assert = async () => await assertExistingCode({wasmModule, canisterId, actor, ...rest});
  await execute({fn: assert, onProgress, step: UpgradeCodeProgressStep.AssertingExistingCode});

  // 2. We stop the canister to prepare for the upgrade.
  const stop = async () => await canisterStop({canisterId, actor});
  await execute({fn: stop, onProgress, step: UpgradeCodeProgressStep.StoppingCanister});

  try {
    // 3. We take a snapshot - create a backup - unless the dev opted-out
    const snapshot = async () =>
      takeSnapshot ? await createSnapshot({canisterId, actor}) : Promise.resolve();
    await execute({fn: snapshot, onProgress, step: UpgradeCodeProgressStep.TakingSnapshot});

    // 4. Upgrading code: If the WASM is > 2MB we proceed with the chunked installation otherwise we use the original single chunk installation method.
    const upgrade = async () => await upgradeCode({wasmModule, canisterId, actor, ...rest});
    await execute({fn: upgrade, onProgress, step: UpgradeCodeProgressStep.UpgradingCode});
  } finally {
    // 5. We restart the canister to finalize the process.
    const restart = async () => await canisterStart({canisterId, actor});
    await execute({fn: restart, onProgress, step: UpgradeCodeProgressStep.RestartingCanister});
  }
};

const execute = async ({
  fn,
  step,
  onProgress
}: {fn: () => Promise<void>; step: UpgradeCodeProgressStep} & Pick<
  UpgradeCodeParams,
  'onProgress'
>) => {
  onProgress?.({
    step,
    state: 'in_progress'
  });

  try {
    await fn();

    onProgress?.({
      step,
      state: 'success'
    });
  } catch (err: unknown) {
    onProgress?.({
      step,
      state: 'error'
    });

    throw err;
  }
};

const assertExistingCode = async ({
  actor,
  canisterId,
  wasmModule,
  reset
}: Pick<UpgradeCodeParams, 'actor' | 'canisterId' | 'wasmModule'> & {reset?: boolean}) => {
  // If we want to reinstall the module we are fine reinstalling the same version of the code
  if (reset === true) {
    return;
  }

  const {module_hash} = await canisterStatus({
    actor,
    canisterId
  });

  const installedHash = fromNullable(module_hash);

  if (isNullish(installedHash)) {
    return;
  }

  const newWasmModuleHash = await uint8ArraySha256(wasmModule);
  const existingWasmModuleHash = uint8ArrayToHexString(installedHash);

  if (newWasmModuleHash !== existingWasmModuleHash) {
    return;
  }

  throw new UpgradeCodeUnchangedError();
};

const upgradeCode = async ({
  wasmModule,
  canisterId,
  actor,
  ...rest
}: Omit<UpgradeCodeParams, 'onProgress'>) => {
  const upgradeType = (): 'chunked' | 'single' => {
    const blob = new Blob([wasmModule as Uint8Array<ArrayBuffer>]);
    return blob.size > SIMPLE_INSTALL_MAX_WASM_SIZE ? 'chunked' : 'single';
  };

  const fn = upgradeType() === 'chunked' ? upgradeChunkedCode : upgradeSingleChunkCode;
  await fn({wasmModule, canisterId, actor, ...rest});
};

const createSnapshot = async (params: Pick<UpgradeCodeParams, 'canisterId' | 'actor'>) => {
  const snapshots = await listCanisterSnapshots(params);

  // TODO: currently only one snapshot per canister is supported on the IC
  await takeCanisterSnapshot({
    ...params,
    snapshotId: snapshots?.[0]?.id
  });
};
