import type {Principal} from '@icp-sdk/core/principal';
import {
  type OrbiterDid,
  type OrbiterParameters,
  getDeprecatedOrbiterVersionActor,
  getOrbiterActor
} from '@junobuild/ic-client/actor';

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

export const setControllers = async ({
  args,
  orbiter
}: {
  args: OrbiterDid.SetControllersArgs;
  orbiter: OrbiterParameters;
}): Promise<[Principal, OrbiterDid.Controller][]> => {
  const {set_controllers} = await getOrbiterActor(orbiter);
  return set_controllers(args);
};

export const memorySize = async ({
  orbiter
}: {
  orbiter: OrbiterParameters;
}): Promise<OrbiterDid.MemorySize> => {
  const {memory_size} = await getOrbiterActor(orbiter);
  return memory_size();
};
