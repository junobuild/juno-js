import {installCode} from '../api/ic.api';
import {UpgradeCodeParams} from '../types/upgrade.types';
import {upgradeChunkedCode} from './upgrade.chunks.handlers';

export const upgrade = async ({wasmModule, ...rest}: UpgradeCodeParams) => {
  const upgradeType = (): 'simple' | 'chunked' => {
    const blob = new Blob([wasmModule]);
    return blob.size > 2000000 ? 'chunked' : 'simple';
  };

  const fn = upgradeType() === 'chunked' ? upgradeChunkedCode : upgradeCode;
  await fn({wasmModule, ...rest});
};

const upgradeCode = async ({actor, ...rest}: UpgradeCodeParams) => {
  await installCode({
    actor,
    code: rest
  });
};
