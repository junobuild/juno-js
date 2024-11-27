import type {canister_install_mode} from '@dfinity/ic-management';
import {Principal} from '@dfinity/principal';
import {ActorParameters} from './actor.types';

export enum UpgradeCodeProgress {
  AssertingExistingCode,
  StoppingCanister,
  UpgradingCode,
  RestartingCanister
}

export type UpgradeCodeProgressStatus = 'in_progress' | 'success' | 'error';

export interface UpgradeCodeParams {
  actor: ActorParameters;
  canisterId: Principal;
  missionControlId?: Principal;
  wasmModule: Uint8Array;
  arg: Uint8Array;
  mode: canister_install_mode;
  preClearChunks?: boolean;
  onProgress?: (params: {progress: UpgradeCodeProgress; status: UpgradeCodeProgressStatus}) => void;
}
