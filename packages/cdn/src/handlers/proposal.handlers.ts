import {createSnapshot} from '../api/ic.api';
import {commitProposal} from '../api/proposal.api';
import {type ApplyProposalParams, ApplyProposalProgressStep} from '../types/proposal.params';

export const applyProposal = async ({
  takeSnapshot = false,
  onProgress,
  cdn,
  ...rest
}: ApplyProposalParams) => {
  // 1. We take a snapshot - if the dev opted-in
  const snapshot = async () => (takeSnapshot ? await createSnapshot({cdn}) : Promise.resolve());
  await execute({fn: snapshot, onProgress, step: ApplyProposalProgressStep.TakingSnapshot});

  // 2. Commit the proposal
  const commit = async () => await commitProposal({cdn, ...rest});
  await execute({fn: commit, onProgress, step: ApplyProposalProgressStep.CommittingProposal});
};

const execute = async ({
  fn,
  step,
  onProgress
}: {fn: () => Promise<void>; step: ApplyProposalProgressStep} & Pick<
  ApplyProposalParams,
  'onProgress'
>) => {
  onProgress?.({
    step,
    state: 'in_progress'
  });

  try {
    await fn();

    onProgress?.({
      step,
      state: 'success'
    });
  } catch (err: unknown) {
    onProgress?.({
      step,
      state: 'error'
    });

    throw err;
  }
};
