import {Principal} from '@dfinity/principal';
import type {OrbiterParameters} from '@junobuild/ic-client';
import {toPrincipal} from '@junobuild/utils';
import {listControllers} from '../api/orbiter.api';
import {INSTALL_MODE_RESET, INSTALL_MODE_UPGRADE} from '../constants/upgrade.constants';
import {upgrade} from '../handlers/upgrade.handlers';
import type {UpgradeCodeParams} from '../types/upgrade';
import {encodeAdminAccessKeysToIDL} from '../utils/idl.utils';

/**
 * Upgrades the Orbiter with the provided WASM module.
 * @param {Object} params - The parameters for upgrading the Orbiter.
 * @param {OrbiterParameters} params.orbiter - The Orbiter parameters, including the actor and orbiter ID.
 * @param {Principal} [params.missionControlId] - Optional. The Mission Control ID to potentially store WASM chunks, enabling reuse across installations.
 * @param {Uint8Array} params.wasmModule - The WASM module to be installed during the upgrade.
 * @param {boolean} [params.reset=false] - Optional. Indicates whether to reset the Orbiter (reinstall) instead of performing an upgrade. Defaults to `false`.
 * @param {boolean} [params.preClearChunks] - Optional. Forces clearing existing chunks before uploading a chunked WASM module. Recommended if the WASM exceeds 2MB.
 * @param {boolean} [params.takeSnapshot=true] - Optional. Whether to take a snapshot before performing the upgrade. Defaults to true.
 * @param {function} [params.onProgress] - Optional. Callback function to track progress during the upgrade process.
 * @throws {Error} Will throw an error if the Orbiter principal is not defined.
 * @returns {Promise<void>} Resolves when the upgrade process is complete.
 */

export const upgradeOrbiter = async ({
  orbiter,
  reset = false,
  ...rest
}: {
  orbiter: OrbiterParameters;
  reset?: boolean;
} & Pick<
  UpgradeCodeParams,
  'wasmModule' | 'missionControlId' | 'preClearChunks' | 'takeSnapshot' | 'onProgress'
>): Promise<void> => {
  const {orbiterId, ...actor} = orbiter;

  if (!orbiterId) {
    throw new Error('No orbiter principal defined.');
  }

  const controllers = await listControllers({orbiter, certified: reset});

  // Only really use in case of --reset
  const arg = encodeAdminAccessKeysToIDL(controllers);

  await upgrade({
    actor,
    canisterId: toPrincipal(orbiterId),
    arg: new Uint8Array(arg),
    mode: reset ? INSTALL_MODE_RESET : INSTALL_MODE_UPGRADE,
    reset,
    ...rest
  });
};
