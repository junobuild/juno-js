export enum DeployProgressStep {
  PrepareDeploy,
  Deploy
}

export type DeployProgressState = 'in_progress' | 'success' | 'error';

export interface DeployProgress {
  step: DeployProgressStep;
  state: DeployProgressState;
}

export interface OnDeployProgress {
  onProgress?: (progress: DeployProgress) => void;
}
