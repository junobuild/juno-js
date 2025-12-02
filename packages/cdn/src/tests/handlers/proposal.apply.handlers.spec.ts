import * as ic from '../../api/ic.api';
import * as proposals from '../../api/proposal.api';
import {executeApplyProposal} from '../../handlers/proposal.apply.handlers';
import type {CdnParameters} from '../../types/actor.params';
import type {CommitProposal} from '../../types/cdn';
import {ApplyProposalProgressStep} from '../../types/proposal.params';
import {mockIdentity, mockSatelliteIdPrincipal} from '../mocks/cdn.mock';

vi.mock(import('../../api/ic.api'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    createSnapshot: vi.fn()
  };
});

vi.mock(import('../../api/proposal.api'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    commitProposal: vi.fn(),
    deleteProposalAssets: vi.fn()
  };
});

describe('executeApplyProposal', () => {
  const cdn: CdnParameters = {
    satellite: {satelliteId: mockSatelliteIdPrincipal, identity: mockIdentity}
  };

  const proposal: CommitProposal = {
    proposal_id: 111n,
    sha256: Uint8Array.from([1, 2, 3])
  };

  const ok = Promise.resolve();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();

    vi.mocked(ic.createSnapshot).mockResolvedValue(undefined);
    vi.mocked(proposals.commitProposal).mockResolvedValue(undefined);
    vi.mocked(proposals.deleteProposalAssets).mockResolvedValue(undefined);
  });

  it('runs all steps (snapshot → commit → clear) and then postApply; reports progress for each', async () => {
    const progress: Array<{
      step: ApplyProposalProgressStep;
      state: 'in_progress' | 'success' | 'error';
    }> = [];
    const onProgress = (e: (typeof progress)[number]) => progress.push(e);

    const postApply = vi.fn(() => ok);

    await executeApplyProposal({
      cdn,
      proposal,
      takeSnapshot: true,
      clearProposalAssets: true,
      onProgress,
      postApply
    });

    expect(ic.createSnapshot).toHaveBeenCalledWith({cdn});
    expect(proposals.commitProposal).toHaveBeenCalledWith({cdn, proposal});
    expect(proposals.deleteProposalAssets).toHaveBeenCalledWith({
      cdn,
      proposalIds: [proposal.proposal_id]
    });
    expect(postApply).toHaveBeenCalledTimes(1);

    expect(progress).toEqual([
      {step: ApplyProposalProgressStep.TakingSnapshot, state: 'in_progress'},
      {step: ApplyProposalProgressStep.TakingSnapshot, state: 'success'},
      {step: ApplyProposalProgressStep.CommittingProposal, state: 'in_progress'},
      {step: ApplyProposalProgressStep.CommittingProposal, state: 'success'},
      {step: ApplyProposalProgressStep.ClearingProposalAssets, state: 'in_progress'},
      {step: ApplyProposalProgressStep.ClearingProposalAssets, state: 'success'},
      {step: ApplyProposalProgressStep.PostApply, state: 'in_progress'},
      {step: ApplyProposalProgressStep.PostApply, state: 'success'}
    ]);
  });

  it('skips snapshot when disabled', async () => {
    const onProgress = vi.fn();
    const postApply = vi.fn(() => ok);

    await executeApplyProposal({
      cdn,
      proposal,
      takeSnapshot: false,
      clearProposalAssets: false,
      onProgress,
      postApply
    });

    expect(ic.createSnapshot).not.toHaveBeenCalled();
    expect(proposals.commitProposal).toHaveBeenCalledTimes(1);
    expect(proposals.deleteProposalAssets).not.toHaveBeenCalled();
  });

  it('bubbles error from commit; does not clear assets; still runs postApply', async () => {
    const err = new Error('commit failed');
    vi.mocked(proposals.commitProposal).mockRejectedValueOnce(err);

    const progress: Array<{
      step: ApplyProposalProgressStep;
      state: 'in_progress' | 'success' | 'error';
    }> = [];
    const onProgress = (e: (typeof progress)[number]) => progress.push(e);

    const postApply = vi.fn(() => ok);

    await expect(
      executeApplyProposal({
        cdn,
        proposal,
        takeSnapshot: true,
        clearProposalAssets: true,
        onProgress,
        postApply
      })
    ).rejects.toThrow(err);

    expect(ic.createSnapshot).toHaveBeenCalledTimes(1);
    expect(proposals.commitProposal).toHaveBeenCalledTimes(1);
    expect(proposals.deleteProposalAssets).not.toHaveBeenCalled();
    expect(postApply).toHaveBeenCalledTimes(1);

    expect(progress).toEqual([
      {step: ApplyProposalProgressStep.TakingSnapshot, state: 'in_progress'},
      {step: ApplyProposalProgressStep.TakingSnapshot, state: 'success'},
      {step: ApplyProposalProgressStep.CommittingProposal, state: 'in_progress'},
      {step: ApplyProposalProgressStep.CommittingProposal, state: 'error'},
      {step: ApplyProposalProgressStep.PostApply, state: 'in_progress'},
      {step: ApplyProposalProgressStep.PostApply, state: 'success'}
    ]);
  });

  it('bubbles error from postApply and marks PostApply as error', async () => {
    const postErr = new Error('post apply failed');
    const postApply = vi.fn(async () => {
      throw postErr;
    });

    const progress: Array<{
      step: ApplyProposalProgressStep;
      state: 'in_progress' | 'success' | 'error';
    }> = [];
    const onProgress = (e: (typeof progress)[number]) => progress.push(e);

    await expect(
      executeApplyProposal({
        cdn,
        proposal,
        takeSnapshot: true,
        clearProposalAssets: true,
        onProgress,
        postApply
      })
    ).rejects.toThrow(postErr);

    expect(ic.createSnapshot).toHaveBeenCalledTimes(1);
    expect(proposals.commitProposal).toHaveBeenCalledTimes(1);
    expect(proposals.deleteProposalAssets).toHaveBeenCalledTimes(1);
    expect(postApply).toHaveBeenCalledTimes(1);

    expect(progress.slice(-2)).toEqual([
      {step: ApplyProposalProgressStep.PostApply, state: 'in_progress'},
      {step: ApplyProposalProgressStep.PostApply, state: 'error'}
    ]);
  });

  it('skips clearing assets when clearProposalAssets = false', async () => {
    const postApply = vi.fn(() => ok);

    await executeApplyProposal({
      cdn,
      proposal,
      takeSnapshot: true,
      clearProposalAssets: false,
      onProgress: undefined,
      postApply
    });

    expect(ic.createSnapshot).toHaveBeenCalledTimes(1);
    expect(proposals.commitProposal).toHaveBeenCalledTimes(1);
    expect(proposals.deleteProposalAssets).not.toHaveBeenCalled();
  });
});
