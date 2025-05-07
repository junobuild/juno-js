import type {CanisterStatusResponse} from '@dfinity/ic-management';
import {Principal} from '@dfinity/principal';
import {assertNonNullish} from '@dfinity/utils';
import {canisterStatus} from '../api/ic.api';
import type {OrbiterParameters} from '../types/actor.types';

/**
 * Retrieves the memory size of the Orbiter.
 * @param {Object} params - The parameters for the Orbiter.
 * @param {OrbiterParameters} params.orbiter - The Orbiter parameters.
 * @returns {Promise<Pick<CanisterStatusResponse, 'memory_size' | 'memory_metrics'>>} A promise that resolves to the memory size of the Orbiter.
 */
export const orbiterMemorySize = async ({
  orbiter
}: {
  orbiter: OrbiterParameters;
}): Promise<Pick<CanisterStatusResponse, 'memory_size' | 'memory_metrics'>> => {
  const {orbiterId, ...actor} = orbiter;

  assertNonNullish(orbiterId, 'No Orbiter ID provided.');

  const {memory_size, memory_metrics} = await canisterStatus({
    actor,
    canisterId: Principal.fromText(orbiterId)
  });

  return {memory_size, memory_metrics};
};
