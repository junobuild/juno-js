import type {Principal} from '@dfinity/principal';
import type {
  Controller,
  MemorySize,
  _SERVICE as OrbiterActor
} from '../../declarations/orbiter/orbiter.did';
import type {OrbiterParameters} from '../types/actor';
import {getDeprecatedOrbiterVersionActor, getOrbiterActor} from './_actor.api';

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
  const actor: OrbiterActor = await getOrbiterActor({...orbiter, certified});
  return actor.list_controllers();
};

export const memorySize = async ({orbiter}: {orbiter: OrbiterParameters}): Promise<MemorySize> => {
  const {memory_size} = await getOrbiterActor(orbiter);
  return memory_size();
};
