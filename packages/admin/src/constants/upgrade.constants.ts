import type {canister_install_mode} from '@dfinity/ic-management';

export const INSTALL_MODE_RESET: canister_install_mode = {reinstall: null};

export const INSTALL_MODE_UPGRADE: canister_install_mode = {
  upgrade: [{skip_pre_upgrade: [false], wasm_memory_persistence: [{replace: null}]}]
};
