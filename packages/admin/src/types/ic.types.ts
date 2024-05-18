import type {canister_id, install_code_args, wasm_module} from '../../declarations/ic/ic.did';

/**
 * Represents the parameters for installing code on a canister.
 * @typedef {Object} InstallCodeParams
 * @property {Uint8Array} arg - The argument to pass to the installation.
 * @property {wasm_module} wasm_module - The WebAssembly module to install.
 * @property {canister_id} canister_id - The ID of the canister.
 * @property {install_code_args['mode']} mode - The mode of the installation.
 */
export type InstallCodeParams = {
  arg: Uint8Array;
  wasm_module: wasm_module;
  canister_id: canister_id;
} & Pick<install_code_args, 'mode'>;
