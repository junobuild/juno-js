import * as proposals from '../../api/proposal.api';
import type {CdnParameters} from '../../types/actor.params';
import type {RejectProposal} from '../../types/cdn';
import {RejectProposalProgressStep} from '../../types/proposal.params';
import {mockIdentity, mockSatelliteIdPrincipal} from '../mocks/cdn.mock';
import {executeRejectProposal} from '../../handlers/proposal.reject.handlers';

vi.mock(import('../../api/proposal.api'), async (importOriginal) => {
  const actual = await importOriginal<typeof proposals>();
  return {
    ...actual,
    rejectProposal: vi.fn(),
    deleteProposalAssets: vi.fn()
  };
});

describe('executeRejectProposal', () => {
  const cdn: CdnParameters = {
    satellite: {satelliteId: mockSatelliteIdPrincipal, identity: mockIdentity}
  };

  const proposal: RejectProposal = {
    proposal_id: 111n,
    sha256: Uint8Array.from([1, 2, 3])
  };

  const ok = Promise.resolve();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(proposals.rejectProposal).mockResolvedValue(undefined);
    vi.mocked(proposals.deleteProposalAssets).mockResolvedValue(undefined);
  });

  it('runs reject → clear (when enabled) → postReject; reports progress in order', async () => {
    const progress: Array<{
      step: RejectProposalProgressStep;
      state: 'in_progress' | 'success' | 'error';
    }> = [];
    const onProgress = (e: (typeof progress)[number]) => progress.push(e);

    const postReject = vi.fn(() => ok);

    await executeRejectProposal({
      cdn,
      proposal,
      clearProposalAssets: true,
      onProgress,
      postReject
    });

    expect(proposals.rejectProposal).toHaveBeenCalledWith({cdn, proposal});
    expect(proposals.deleteProposalAssets).toHaveBeenCalledWith({
      cdn,
      proposalIds: [proposal.proposal_id]
    });
    expect(postReject).toHaveBeenCalledTimes(1);

    expect(progress).toEqual([
      {step: RejectProposalProgressStep.RejectingProposal, state: 'in_progress'},
      {step: RejectProposalProgressStep.RejectingProposal, state: 'success'},
      {step: RejectProposalProgressStep.ClearingProposalAssets, state: 'in_progress'},
      {step: RejectProposalProgressStep.ClearingProposalAssets, state: 'success'},
      {step: RejectProposalProgressStep.PostReject, state: 'in_progress'},
      {step: RejectProposalProgressStep.PostReject, state: 'success'}
    ]);
  });

  it('skips clearing assets when disabled', async () => {
    const onProgress = vi.fn();
    const postReject = vi.fn(() => ok);

    await executeRejectProposal({
      cdn,
      proposal,
      clearProposalAssets: false,
      onProgress,
      postReject
    });

    expect(proposals.rejectProposal).toHaveBeenCalledTimes(1);
    expect(proposals.deleteProposalAssets).not.toHaveBeenCalled();
    expect(postReject).toHaveBeenCalledTimes(1);
  });

  it('bubbles error from reject; does not clear; still runs postReject', async () => {
    const err = new Error('reject failed');
    vi.mocked(proposals.rejectProposal).mockRejectedValueOnce(err);

    const progress: Array<{
      step: RejectProposalProgressStep;
      state: 'in_progress' | 'success' | 'error';
    }> = [];
    const onProgress = (e: (typeof progress)[number]) => progress.push(e);

    const postReject = vi.fn(() => ok);

    await expect(
      executeRejectProposal({
        cdn,
        proposal,
        clearProposalAssets: true,
        onProgress,
        postReject
      })
    ).rejects.toThrow(err);

    expect(proposals.rejectProposal).toHaveBeenCalledTimes(1);
    expect(proposals.deleteProposalAssets).not.toHaveBeenCalled();
    expect(postReject).toHaveBeenCalledTimes(1);

    expect(progress).toEqual([
      {step: RejectProposalProgressStep.RejectingProposal, state: 'in_progress'},
      {step: RejectProposalProgressStep.RejectingProposal, state: 'error'},
      {step: RejectProposalProgressStep.PostReject, state: 'in_progress'},
      {step: RejectProposalProgressStep.PostReject, state: 'success'}
    ]);
  });

  it('bubbles error from postReject and marks PostReject as error', async () => {
    const postErr = new Error('post reject failed');
    const postReject = vi.fn(async () => {
      throw postErr;
    });

    const progress: Array<{
      step: RejectProposalProgressStep;
      state: 'in_progress' | 'success' | 'error';
    }> = [];
    const onProgress = (e: (typeof progress)[number]) => progress.push(e);

    await expect(
      executeRejectProposal({
        cdn,
        proposal,
        clearProposalAssets: true,
        onProgress,
        postReject
      })
    ).rejects.toThrow(postErr);

    expect(proposals.rejectProposal).toHaveBeenCalledTimes(1);
    expect(proposals.deleteProposalAssets).toHaveBeenCalledTimes(1);

    expect(progress.slice(-2)).toEqual([
      {step: RejectProposalProgressStep.PostReject, state: 'in_progress'},
      {step: RejectProposalProgressStep.PostReject, state: 'error'}
    ]);
  });
});
