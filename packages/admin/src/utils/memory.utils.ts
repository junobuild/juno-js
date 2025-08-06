import {fromNullable, nonNullish, toNullable} from '@dfinity/utils';
import {ConfigNumberSchema, MaxMemorySizeConfig} from '@junobuild/config';
import type {ConfigMaxMemorySize} from '../../declarations/satellite/satellite.did';

export const toMaxMemorySize = (
  configMaxMemorySize?: MaxMemorySizeConfig
): [] | [ConfigMaxMemorySize] =>
  toNullable(
    nonNullish(configMaxMemorySize) &&
      (nonNullish(toNullable(configMaxMemorySize.heap)) ||
        nonNullish(toNullable(configMaxMemorySize.stable)))
      ? {
          heap: toNullable(
            nonNullish(configMaxMemorySize.heap)
              ? ConfigNumberSchema.parse(configMaxMemorySize.heap)
              : undefined
          ),
          stable: toNullable(
            nonNullish(configMaxMemorySize.stable)
              ? ConfigNumberSchema.parse(configMaxMemorySize.stable)
              : undefined
          )
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
