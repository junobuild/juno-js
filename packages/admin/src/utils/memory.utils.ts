import type {MaxMemorySizeConfig} from '@junobuild/config';
import {nonNullish, toNullable} from '@junobuild/utils';
import type {ConfigMaxMemorySize} from '../../declarations/satellite/satellite.did';

export const toMaxMemorySize = (
  configMaxMemorySize?: MaxMemorySizeConfig
): [] | [ConfigMaxMemorySize] =>
  toNullable(
    nonNullish(configMaxMemorySize)
      ? {
          heap: toNullable(configMaxMemorySize.heap),
          stable: toNullable(configMaxMemorySize.stable)
        }
      : undefined
  );
