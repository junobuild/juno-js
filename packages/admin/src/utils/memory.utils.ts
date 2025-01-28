import {nonNullish, toNullable} from '@dfinity/utils';
import type {MaxMemorySizeConfig} from '@junobuild/config';
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
