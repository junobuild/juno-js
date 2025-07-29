import {fromNullable, nonNullish, toNullable} from '@dfinity/utils';
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

export const fromMaxMemorySize = (
  configMaxMemorySize: [] | [ConfigMaxMemorySize]
): {maxMemorySize?: MaxMemorySizeConfig} => {
  const memorySize = fromNullable(configMaxMemorySize);
  const heap = fromNullable(memorySize?.heap ?? []);
  const stable = fromNullable(memorySize?.stable ?? []);

  return {
    ...(nonNullish(memorySize) && {
      maxMemorySize: {
        ...(nonNullish(heap) && {heap}),
        ...(nonNullish(stable) && {stable})
      }
    })
  };
};
