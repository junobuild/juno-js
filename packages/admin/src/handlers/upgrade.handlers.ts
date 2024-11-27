import {fromNullable, isNullish} from '@junobuild/utils';
import {canisterStart, canisterStatus, canisterStop} from '../api/ic.api';
import {SIMPLE_INSTALL_MAX_WASM_SIZE} from '../constants/upgrade.constants';
import {UpgradeCodeUnchangedError} from '../errors/upgrade.errors';
import {UpgradeCodeParams, UpgradeCodeProgress} from '../types/upgrade.types';
import {uint8ArrayToHexString} from '../utils/array.utils';
import {uint8ArraySha256} from '../utils/crypto.utils';
import {upgradeSingleChunkCode} from './upgrade.single.handlers';

export const upgrade = async ({
  wasmModule,
  canisterId,
  actor,
  onProgress,
  ...rest
}: UpgradeCodeParams) => {
  // 1. We verify that the code to be installed is different from the code already deployed. If the codes are identical, we skip the installation.
  // TODO: unless mode is reinstall
  const assert = async () => await assertExistingCode({wasmModule, canisterId, actor, ...rest});
  await execute({fn: assert, onProgress, progress: UpgradeCodeProgress.AssertingExistingCode});

  // 2. We stop the canister to prepare for the upgrade.
  const stop = async () => await canisterStop({canisterId, actor});
  await execute({fn: stop, onProgress, progress: UpgradeCodeProgress.StoppingCanister});

  try {
    // 3. Upgrading code: If the WASM is > 2MB we proceed with the chunked installation otherwise we use the original single chunk installation method.
    const upgrade = async () => await upgradeCode({wasmModule, canisterId, actor, ...rest});
    await execute({fn: upgrade, onProgress, progress: UpgradeCodeProgress.UpgradingCode});
  } finally {
    // 4. We restart the canister to finalize the process.
    const restart = async () => await canisterStart({canisterId, actor});
    await execute({fn: restart, onProgress, progress: UpgradeCodeProgress.RestartingCanister});
  }
};

const execute = async ({
  fn,
  progress,
  onProgress
}: {fn: () => Promise<void>; progress: UpgradeCodeProgress} & Pick<
  UpgradeCodeParams,
  'onProgress'
>) => {
  onProgress?.({
    progress,
    status: 'in_progress'
  });

  try {
    await fn();

    onProgress?.({
      progress,
      status: 'success'
    });
  } catch (err: unknown) {
    onProgress?.({
      progress,
      status: 'error'
    });

    throw err;
  }
};

const assertExistingCode = async ({
  actor,
  canisterId,
  wasmModule
}: Pick<UpgradeCodeParams, 'actor' | 'canisterId' | 'wasmModule'>) => {
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
  // We install the new code, effectively performing an upgrade.
  // TODO: remove eslint ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const upgradeType = (): 'simple' | 'chunked' => {
    const blob = new Blob([wasmModule]);
    return blob.size > SIMPLE_INSTALL_MAX_WASM_SIZE ? 'chunked' : 'simple';
  };

  // TODO: upgradeChunkedCode does not work on mainnet. Either an IC or agent-js issue.
  // e: Server returned an error:
  //   Code: 400 (Bad Request)
  //   Body: error: canister_not_found
  // details: The specified canister does not exist.
  // const fn = upgradeType() === 'chunked' ? upgradeChunkedCode : upgradeSingleChunkCode;
  const fn = upgradeSingleChunkCode;

  await fn({wasmModule, canisterId, actor, ...rest});
};
