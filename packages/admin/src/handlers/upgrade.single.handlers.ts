import {installCode} from '../api/ic.api';
import type {UpgradeCodeParams} from '../types/upgrade';

export const upgradeSingleChunkCode = async ({actor, ...rest}: UpgradeCodeParams) => {
  await installCode({
    actor,
    code: rest
  });
};
