import {nonNullish} from '@dfinity/utils';
import {createSnapshot} from '../api/ic.api';
import {commitProposal, deleteProposalAssets} from '../api/proposal.api';
import {type ApplyProposalParams, ApplyProposalProgressStep} from '../types/proposal.params';

export const executeApplyProposal = async ({
  takeSnapshot = false,
  clearProposalAssets = false,
  onProgress,
  cdn,
  proposal,
  postApply
}: ApplyProposalParams) => {
  try {
    // 1. We take a snapshot - if the dev opted-in
    const snapshot = async () => (takeSnapshot ? await createSnapshot({cdn}) : Promise.resolve());
    await execute({fn: snapshot, onProgress, step: ApplyProposalProgressStep.TakingSnapshot});

    // 2. Commit the proposal
    const commit = async () => await commitProposal({cdn, proposal});
    await execute({fn: commit, onProgress, step: ApplyProposalProgressStep.CommittingProposal});

    // 3. Clear proposal assets if required
    const clear = async () =>
      clearProposalAssets
        ? await deleteProposalAssets({cdn, proposal_ids: [proposal.proposal_id]})
        : Promise.resolve();
    await execute({fn: clear, onProgress, step: ApplyProposalProgressStep.ClearingProposalAssets});
  } finally {
    // 4. If provided, the post apply runs in any case
    const job = async () => (nonNullish(postApply) ? await postApply() : Promise.resolve());
    await execute({fn: job, onProgress, step: ApplyProposalProgressStep.PostApply});
  }
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
