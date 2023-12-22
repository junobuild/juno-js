import type {Principal} from '@dfinity/principal';
import type {
  Controller,
  MemorySize,
  _SERVICE as OrbiterActor
} from '../../declarations/orbiter/orbiter.did';
import type {OrbiterParameters} from '../types/actor.types';
import {getOrbiterActor} from './actor.api';

export const version = async ({orbiter}: {orbiter: OrbiterParameters}): Promise<string> => {
  const actor: OrbiterActor = await getOrbiterActor(orbiter);
  return actor.version();
};

export const listControllers = async ({
  orbiter
}: {
  orbiter: OrbiterParameters;
}): Promise<[Principal, Controller][]> => {
  const actor: OrbiterActor = await getOrbiterActor(orbiter);
  return actor.list_controllers();
};

export const memorySize = async ({orbiter}: {orbiter: OrbiterParameters}): Promise<MemorySize> => {
  const {memory_size} = await getOrbiterActor(orbiter);
  return memory_size();
};
