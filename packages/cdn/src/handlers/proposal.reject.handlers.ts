import {nonNullish} from '@dfinity/utils';
import {deleteProposalAssets, rejectProposal} from '../api/proposal.api';
import {type RejectProposalParams, RejectProposalProgressStep} from '../types/proposal.params';

export const executeRejectProposal = async ({
  clearProposalAssets = false,
  onProgress,
  cdn,
  proposal,
  postReject
}: RejectProposalParams) => {
  try {
    // 1. Reject the proposal
    const reject = async () => await rejectProposal({cdn, proposal});
    await execute({fn: reject, onProgress, step: RejectProposalProgressStep.RejectingProposal});

    // 2. Clear proposal assets if required
    const clear = async () =>
      clearProposalAssets
        ? await deleteProposalAssets({cdn, proposal_ids: [proposal.proposal_id]})
        : Promise.resolve();
    await execute({fn: clear, onProgress, step: RejectProposalProgressStep.ClearingProposalAssets});
  } finally {
    // 3. If provided, the post apply runs in any case
    const job = async () => (nonNullish(postReject) ? await postReject() : Promise.resolve());
    await execute({fn: job, onProgress, step: RejectProposalProgressStep.PostReject});
  }
};

const execute = async ({
  fn,
  step,
  onProgress
}: {fn: () => Promise<void>; step: RejectProposalProgressStep} & Pick<
  RejectProposalParams,
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
