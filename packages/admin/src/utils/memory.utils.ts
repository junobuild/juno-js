import {fromNullable, nonNullish, toNullable} from '@dfinity/utils';
import type {MaxMemorySizeConfig} from '@junobuild/config';
import type {ConfigMaxMemorySize} from '@junobuild/ic-client/dist/declarations/satellite/satellite.did';

export const toMaxMemorySize = (
  configMaxMemorySize?: MaxMemorySizeConfig
): [] | [ConfigMaxMemorySize] =>
  toNullable(
    nonNullish(configMaxMemorySize) &&
      (nonNullish(toNullable(configMaxMemorySize.heap)) ||
        nonNullish(toNullable(configMaxMemorySize.stable)))
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
    ...(nonNullish(memorySize) &&
      (nonNullish(heap) || nonNullish(stable)) && {
        maxMemorySize: {
          ...(nonNullish(heap) && {heap}),
          ...(nonNullish(stable) && {stable})
        }
      })
  };
};
