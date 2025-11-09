import type {canister_install_mode} from '@icp-sdk/canisters/ic-management';

export const SIMPLE_INSTALL_MAX_WASM_SIZE = 2_000_000;
export const INSTALL_MAX_CHUNK_SIZE = 1_000_000;

export const INSTALL_MODE_RESET: canister_install_mode = {reinstall: null};

export const INSTALL_MODE_UPGRADE: canister_install_mode = {
  upgrade: [{skip_pre_upgrade: [false], wasm_memory_persistence: [{replace: null}]}]
};
