import type {ActorParameters} from '@junobuild/ic-client/actor';
import {upgrade} from '../handlers/upgrade.handlers';
import type {UpgradeCodeParams} from '../types/upgrade';

/**
 * Upgrades a module with the provided WASM code and arguments. This generic is notably useful for Juno Docker.
 *
 * @param {Object} params - Parameters for upgrading the module.
 * @param {ActorParameters} params.actor - The actor parameters associated with the module.
 * @param {Principal} params.canisterId - The ID of the canister being upgraded.
 * @param {Principal} [params.missionControlId] - Optional. An ID to store and reuse WASM chunks across installations.
 * @param {Uint8Array} params.wasmModule - The WASM code to be installed during the upgrade.
 * @param {Uint8Array} params.arg - The initialization argument for the module upgrade.
 * @param {canister_install_mode} params.mode - The installation mode, e.g., `upgrade` or `reinstall`.
 * @param {boolean} [params.preClearChunks] - Optional. Forces clearing existing chunks before uploading a chunked WASM module. Recommended for WASM modules larger than 2MB.
 * @param {function} [params.onProgress] - Optional. Callback function to track progress during the upgrade process.
 * @param {boolean} [params.reset=false] - Optional. Specifies whether to reset the module (reinstall) instead of performing an upgrade. Defaults to `false`.
 * @throws {Error} Will throw an error if the parameters are invalid or if the upgrade process fails.
 * @returns {Promise<void>} Resolves when the upgrade process is complete.
 */
export const upgradeModule = async (
  params: {
    actor: ActorParameters;
    reset?: boolean;
  } & UpgradeCodeParams
): Promise<void> => {
  await upgrade(params);
};
