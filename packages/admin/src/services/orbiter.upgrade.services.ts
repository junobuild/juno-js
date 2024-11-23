import {Principal} from '@dfinity/principal';
import {listControllers} from '../api/orbiter.api';
import {INSTALL_MODE_RESET, INSTALL_MODE_UPGRADE} from '../constants/upgrade.constants';
import {upgrade} from '../handlers/upgrade.handlers';
import type {OrbiterParameters} from '../types/actor.types';
import {encodeIDLControllers} from '../utils/idl.utils';

/**
 * Upgrades the Orbiter with the provided WASM module.
 * @param {Object} params - The parameters for upgrading the Orbiter.
 * @param {OrbiterParameters} params.orbiter - The Orbiter parameters.
 * @param {Principal} [params.missionControlId] - The optional Mission Control ID in which the WASM chunks can potentially be stored. Useful to reuse chunks across installations.
 * @param {Uint8Array} params.wasm_module - The WASM module for the upgrade.
 * @param {boolean} [params.reset=false] - Whether to reset the Orbiter (reinstall) instead of upgrading.
 * @throws Will throw an error if no orbiter principal is defined.
 * @returns {Promise<void>} A promise that resolves when the upgrade is complete.
 */
export const upgradeOrbiter = async ({
  orbiter,
                                       missionControlId,
  wasmModule,
  reset = false
}: {
  orbiter: OrbiterParameters;
  missionControlId?: Principal;
  wasmModule: Uint8Array;
  reset?: boolean;
}): Promise<void> => {
  const {orbiterId, ...actor} = orbiter;

  if (!orbiterId) {
    throw new Error('No orbiter principal defined.');
  }

  const controllers = await listControllers({orbiter});

  const arg = encodeIDLControllers(controllers);

  await upgrade({
    actor,
    canisterId: Principal.fromText(orbiterId),
    missionControlId,
    arg: new Uint8Array(arg),
    wasmModule,
    mode: reset ? INSTALL_MODE_RESET : INSTALL_MODE_UPGRADE
  });
};
