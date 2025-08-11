import type {Principal} from '@dfinity/principal';
import {type OrbiterDid,
  type OrbiterParameters,
  getDeprecatedOrbiterVersionActor,
  getOrbiterActor
} from '@junobuild/ic-client';

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
}): Promise<[Principal, OrbiterDid.Controller][]> => {
  const {list_controllers} = await getOrbiterActor({...orbiter, certified});
  return list_controllers();
};

export const memorySize = async ({
  orbiter
}: {
  orbiter: OrbiterParameters;
}): Promise<OrbiterDid.MemorySize> => {
  const {memory_size} = await getOrbiterActor(orbiter);
  return memory_size();
};
