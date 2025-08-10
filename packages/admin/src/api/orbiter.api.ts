import type {Principal} from '@dfinity/principal';
import type {OrbiterParameters} from '@junobuild/ic-client';
import {getDeprecatedOrbiterVersionActor, getOrbiterActor} from '@junobuild/ic-client';
import type {
  Controller,
  MemorySize
} from '@junobuild/ic-client/dist/declarations/orbiter/orbiter.did';

/**
 * @deprecated - Replaced in Orbiter > v0.0.8 with public custom section juno:package
 */
export const version = async ({orbiter}: {orbiter: OrbiterParameters}): Promise<string> => {
  const {version} = await getDeprecatedOrbiterVersionActor(orbiter);
  return version();
};

export const listControllers = async ({
  orbiter,
  certified
}: {
  orbiter: OrbiterParameters;
  certified?: boolean;
}): Promise<[Principal, Controller][]> => {
  const {list_controllers} = await getOrbiterActor({...orbiter, certified});
  return list_controllers();
};

export const memorySize = async ({orbiter}: {orbiter: OrbiterParameters}): Promise<MemorySize> => {
  const {memory_size} = await getOrbiterActor(orbiter);
  return memory_size();
};
