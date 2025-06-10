import type {CdnParameters} from './actor.params';
import type {CommitProposal} from './cdn';

export enum ApplyProposalProgressStep {
  TakingSnapshot,
  CommittingProposal,
  ClearingProposalAssets,
  PostApply
}

export enum RejectProposalProgressStep {
  RejectingProposal,
  ClearingProposalAssets,
  PostReject
}

export type ProposalProgressState = 'in_progress' | 'success' | 'error';

export interface ApplyProposalProgress {
  step: ApplyProposalProgressStep;
  state: ProposalProgressState;
}

export interface RejectProposalProgress {
  step: RejectProposalProgressStep;
  state: ProposalProgressState;
}

export interface ApplyProposalParams {
  cdn: CdnParameters;
  proposal: CommitProposal;
  takeSnapshot?: boolean;
  clearProposalAssets?: boolean;
  postApply?: () => Promise<void>;
  onProgress?: (progress: ApplyProposalProgress) => void;
}

export type RejectProposalParams = Omit<
  ApplyProposalParams,
  'postApply' | 'takeSnapshot' | 'onProgress'
> & {
  postReject?: () => Promise<void>;
  onProgress?: (progress: RejectProposalProgress) => void;
};
