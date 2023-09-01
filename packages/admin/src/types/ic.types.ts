import type {canister_id, wasm_module} from '../../declarations/ic/ic.did';

export interface InstallCodeParams {
  arg: Uint8Array;
  wasm_module: wasm_module;
  mode: {reinstall: null} | {upgrade: null} | {install: null};
  canister_id: canister_id;
  sender_canister_version: [] | [bigint];
}
