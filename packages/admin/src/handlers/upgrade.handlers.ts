import {fromNullable, isNullish} from '@junobuild/utils';
import {canisterStart, canisterStatus, canisterStop, installCode} from '../api/ic.api';
import {SIMPLE_INSTALL_MAX_WASM_SIZE} from '../constants/upgrade.constants';
import {UpgradeCodeUnchangedError} from '../errors/upgrade.errors';
import {UpgradeCodeParams, UpgradeCodeProgress} from '../types/upgrade.types';
import {uint8ArrayToHexString} from '../utils/array.utils';
import {uint8ArraySha256} from '../utils/crypto.utils';

export const upgrade = async ({
  wasmModule,
  canisterId,
  actor,
  onProgress,
  ...rest
}: UpgradeCodeParams) => {
  // 1. Asserting existing code
  onProgress?.(UpgradeCodeProgress.AssertingExistingCode);

  // We verify that the code to be installed is different from the code already deployed. If the codes are identical, we skip the installation.
  // TODO: unless mode is reinstall
  await assertExistingCode({wasmModule, canisterId, actor, ...rest});

  // 2. Stopping canister: We stop the canister to prepare for the upgrade.
  onProgress?.(UpgradeCodeProgress.StoppingCanister);

  // We stop the canister to prepare for the upgrade.
  await canisterStop({canisterId, actor});

  try {
    // 3. Notify progress: Upgrading code
    onProgress?.(UpgradeCodeProgress.UpgradingCode);

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
    // const fn = upgradeType() === 'chunked' ? upgradeChunkedCode : upgradeCode;
    const fn = upgradeCode;

    await fn({wasmModule, canisterId, actor, ...rest});
  } finally {
    // 4. Restarting canister
    onProgress?.(UpgradeCodeProgress.RestartingCanister);

    // We restart the canister to finalize the process.
    await canisterStart({canisterId, actor});
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

const upgradeCode = async ({actor, ...rest}: UpgradeCodeParams) => {
  await installCode({
    actor,
    code: rest
  });
};
