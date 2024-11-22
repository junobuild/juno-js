import {Principal} from '@dfinity/principal';
import {upgradeCode} from '../api/ic.api';
import {listControllers} from '../api/orbiter.api';
import type {OrbiterParameters} from '../types/actor.types';
import {encodeIDLControllers} from '../utils/idl.utils';

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
  wasmModule,
  reset = false
}: {
  orbiter: OrbiterParameters;
  wasmModule: Uint8Array;
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
      canisterId: Principal.fromText(orbiterId),
      arg: new Uint8Array(arg),
      wasmModule,
      mode: reset
        ? {reinstall: null}
        : {upgrade: [{skip_pre_upgrade: [false], wasm_memory_persistence: [{replace: null}]}]}
    }
  });
};
