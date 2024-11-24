import {fromNullable, isNullish} from '@junobuild/utils';
import {canisterStatus, installCode} from '../api/ic.api';
import {SIMPLE_INSTALL_MAX_WASM_SIZE} from '../constants/upgrade.constants';
import {UpgradeCodeParams, UpgradeCodeUnchangedError} from '../types/upgrade.types';
import {uint8ArrayToHexString} from '../utils/array.utils';
import {uint8ArraySha256} from '../utils/crypto.utils';
import {upgradeChunkedCode} from './upgrade.chunks.handlers';

export const upgrade = async ({wasmModule, ...rest}: UpgradeCodeParams) => {
  await assertExistingCode({wasmModule, ...rest});

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

  await fn({wasmModule, ...rest});
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
