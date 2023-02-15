import type {canister_id, wasm_module} from '../../declarations/ic/ic.did';

export interface InstallCodeParams {
  arg: Array<number>;
  wasm_module: wasm_module;
  mode: {reinstall: null} | {upgrade: null} | {install: null};
  canister_id: canister_id;
}
