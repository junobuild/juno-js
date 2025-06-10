import type {CdnParameters} from './actor.params';
import type {CommitProposal} from './cdn';

export enum ApplyProposalProgressStep {
  TakingSnapshot,
  CommittingProposal
}

export type ApplyProposalProgressState = 'in_progress' | 'success' | 'error';

export interface ApplyProposalProgress {
  step: ApplyProposalProgressStep;
  state: ApplyProposalProgressState;
}

export interface ApplyProposalParams {
  cdn: CdnParameters;
  proposal: CommitProposal;
  takeSnapshot?: boolean;
  onProgress?: (progress: ApplyProposalProgress) => void;
}
