import type {canister_install_mode} from '@dfinity/ic-management';
import type {Principal} from '@dfinity/principal';
import type {ActorParameters} from './actor';

export enum UpgradeCodeProgressStep {
  AssertingExistingCode,
  StoppingCanister,
  TakingSnapshot,
  UpgradingCode,
  RestartingCanister
}

export type UpgradeCodeProgressState = 'in_progress' | 'success' | 'error';

export interface UpgradeCodeProgress {
  step: UpgradeCodeProgressStep;
  state: UpgradeCodeProgressState;
}

export interface UpgradeCodeParams {
  actor: ActorParameters;
  canisterId: Principal;
  missionControlId?: Principal;
  wasmModule: Uint8Array;
  arg: Uint8Array;
  mode: canister_install_mode;
  preClearChunks?: boolean;
  takeSnapshot?: boolean;
  onProgress?: (progress: UpgradeCodeProgress) => void;
}
