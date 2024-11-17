import {Principal} from '@dfinity/principal';
import type {Controller} from '../../declarations/mission_control/mission_control.did';
import type {MemorySize} from '../../declarations/orbiter/orbiter.did';
import {upgradeCode} from '../api/ic.api';
import {listControllers, memorySize, version} from '../api/orbiter.api';
import type {OrbiterParameters} from '../types/actor.types';
import {encodeIDLControllers} from '../utils/idl.utils';

/**
 * Retrieves the version of the Orbiter.
 * @param {Object} params - The parameters for the Orbiter.
 * @param {OrbiterParameters} params.orbiter - The Orbiter parameters.
 * @returns {Promise<string>} A promise that resolves to the version of the Orbiter.
 */
export const orbiterVersion = (params: {orbiter: OrbiterParameters}): Promise<string> =>
  version(params);

/**
 * Upgrades the Orbiter with the provided WASM module.
 * @param {Object} params - The parameters for upgrading the Orbiter.
 * @param {OrbiterParameters} params.orbiter - The Orbiter parameters.
 * @param {Uint8Array} params.wasm_module - The WASM module for the upgrade.
 * @param {boolean} [params.reset=false] - Whether to reset the Orbiter (reinstall) instead of upgrading.
 * @throws Will throw an error if no orbiter principal is defined.
 * @returns {Promise<void>} A promise that resolves when the upgrade is complete.
 */
export const upgradeOrbiter = async ({
  orbiter,
  wasm_module,
  reset = false
}: {
  orbiter: OrbiterParameters;
  wasm_module: Uint8Array;
  reset?: boolean;
}): Promise<void> => {
  const {orbiterId, ...actor} = orbiter;

  if (!orbiterId) {
    throw new Error('No orbiter principal defined.');
  }

  const controllers = await listControllers({orbiter});

  const arg = encodeIDLControllers(controllers);

  await upgradeCode({
    actor,
    code: {
      canister_id: Principal.fromText(orbiterId),
      arg: new Uint8Array(arg),
      wasm_module,
      mode: reset
        ? {reinstall: null}
        : {upgrade: [{skip_pre_upgrade: [false], wasm_memory_persistence: [{replace: null}]}]}
    }
  });
};

/**
 * Retrieves the memory size of the Orbiter.
 * @param {Object} params - The parameters for the Orbiter.
 * @param {OrbiterParameters} params.orbiter - The Orbiter parameters.
 * @returns {Promise<MemorySize>} A promise that resolves to the memory size of the Orbiter.
 */
export const orbiterMemorySize = (params: {orbiter: OrbiterParameters}): Promise<MemorySize> =>
  memorySize(params);

/**
 * Lists the controllers of the Orbiter.
 * @param {Object} params - The parameters for listing the controllers.
 * @param {OrbiterParameters} params.orbiter - The Orbiter parameters.
 * @returns {Promise<[Principal, Controller][]>} A promise that resolves to a list of controllers.
 */
export const listOrbiterControllers = (params: {
  orbiter: OrbiterParameters;
}): Promise<[Principal, Controller][]> => listControllers(params);
