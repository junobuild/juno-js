import {canister_id, install_code_args, wasm_module} from '../../declarations/ic/ic.did';

export type InstallCodeParams = {
  arg: Uint8Array;
  wasm_module: wasm_module;
  canister_id: canister_id;
} & Pick<install_code_args, 'mode'>;
