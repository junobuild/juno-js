export enum DeployProgressStep {
  PrepareDeploy,
  Deploy
}

export enum DeployProgressWithProposalStep {
  PrepareDeploy,
  InitProposal,
  Deploy,
  SubmitProposal,
  CommitProposal
}

export type DeployProgressState = 'in_progress' | 'success' | 'error';

export interface DeployProgress<Step> {
  step: Step;
  state: DeployProgressState;
}

export interface OnDeployProgress<Step> {
  onProgress?: (progress: DeployProgress<Step>) => void;
}
