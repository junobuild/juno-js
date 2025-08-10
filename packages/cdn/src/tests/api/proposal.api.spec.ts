import {
  ListProposalResults,
  ListProposalsParams
} from '@junobuild/core/declarations/satellite/satellite.did';
import * as actor from '@junobuild/ic-client';
import {
  commitProposal,
  countProposals,
  deleteProposalAssets,
  getProposal,
  initProposal,
  listProposals,
  rejectProposal,
  submitProposal
} from '../../api/proposal.api';
import {CdnParameters} from '../../types/actor.params';
import {CommitProposal, Proposal, ProposalId, ProposalType, RejectProposal} from '../../types/cdn';
import {mockIdentity, mockSatelliteIdPrincipal} from '../mocks/cdn.mock';

vi.mock(import('@junobuild/ic-client'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getSatelliteActor: vi.fn()
  };
});

const mockActor = {
  init_proposal: vi.fn(),
  submit_proposal: vi.fn(),
  reject_proposal: vi.fn(),
  commit_proposal: vi.fn(),
  delete_proposal_assets: vi.fn(),
  count_proposals: vi.fn(),
  list_proposals: vi.fn(),
  get_proposal: vi.fn()
};

describe('proposals.api', () => {
  const cdn: CdnParameters = {
    satellite: {satelliteId: mockSatelliteIdPrincipal, identity: mockIdentity}
  };

  beforeEach(() => {
    vi.restoreAllMocks();

    // @ts-ignore
    vi.mocked(actor.getSatelliteActor).mockResolvedValue(mockActor);
  });

  describe('initProposal', () => {
    const proposalType: ProposalType = {AssetsUpgrade: {clear_existing_assets: [false]}};

    it('returns [id, proposal]', async () => {
      const id: ProposalId = 1n;
      const proposal: Proposal = {title: 'hello'} as unknown as Proposal;

      mockActor.init_proposal.mockResolvedValue([id, proposal]);

      const result = await initProposal({cdn, proposalType});

      expect(result).toEqual<[ProposalId, Proposal]>([id, proposal]);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.init_proposal.mockRejectedValueOnce(err);

      await expect(initProposal({cdn, proposalType})).rejects.toThrow(err);
    });
  });

  describe('submitProposal', () => {
    it('returns [id, proposal]', async () => {
      const id: ProposalId = 2n;
      const proposal: Proposal = {status: {Executed: null}} as unknown as Proposal;
      mockActor.submit_proposal.mockResolvedValue([id, proposal]);

      const result = await submitProposal({cdn, proposalId: id});

      expect(result).toEqual<[ProposalId, Proposal]>([id, proposal]);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.submit_proposal.mockRejectedValueOnce(err);
      await expect(submitProposal({cdn, proposalId: 2n})).rejects.toThrow(err);
    });
  });

  describe('rejectProposal', () => {
    const payload: RejectProposal = {
      sha256: Uint8Array.from([1, 2, 3]),
      proposal_id: 456n
    };

    it('resolves void', async () => {
      mockActor.reject_proposal.mockResolvedValue(undefined);

      await expect(rejectProposal({cdn, proposal: payload})).resolves.toBeUndefined();
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');

      mockActor.reject_proposal.mockRejectedValueOnce(err);

      await expect(rejectProposal({cdn, proposal: payload})).rejects.toThrow(err);
    });
  });

  describe('commitProposal', () => {
    const payload: CommitProposal = {
      sha256: Uint8Array.from([1, 2, 3]),
      proposal_id: 456n
    };

    it('resolves void', async () => {
      mockActor.commit_proposal.mockResolvedValue(undefined);

      await expect(commitProposal({cdn, proposal: payload})).resolves.toBeUndefined();
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.commit_proposal.mockRejectedValueOnce(err);

      await expect(commitProposal({cdn, proposal: payload})).rejects.toThrow(err);
    });
  });

  describe('deleteProposalAssets', () => {
    const ids: ProposalId[] = [1n, 2n, 3n];

    it('resolves void', async () => {
      mockActor.delete_proposal_assets.mockResolvedValue(undefined);

      await expect(deleteProposalAssets({cdn, proposalIds: ids})).resolves.toBeUndefined();
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.delete_proposal_assets.mockRejectedValueOnce(err);

      await expect(deleteProposalAssets({cdn, proposalIds: ids})).rejects.toThrow(err);
    });
  });

  describe('countProposals', () => {
    it('returns a bigint', async () => {
      mockActor.count_proposals.mockResolvedValue(42n);

      const result = await countProposals({cdn});

      expect(result).toBe(42n);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');

      mockActor.count_proposals.mockRejectedValueOnce(err);

      await expect(countProposals({cdn})).rejects.toThrow(err);
    });
  });

  describe('listProposals', () => {
    const filter: ListProposalsParams = {order: [], paginate: []};

    it('returns the list results', async () => {
      const list: ListProposalResults = {
        items: [],
        items_length: 1n,
        matches_length: 1n
      };

      mockActor.list_proposals.mockResolvedValue(list);

      const result = await listProposals({cdn, filter});

      expect(result).toEqual(list);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');

      mockActor.list_proposals.mockRejectedValueOnce(err);

      await expect(listProposals({cdn, filter})).rejects.toThrow(err);
    });
  });

  describe('getProposal', () => {
    it('returns [Proposal] when found', async () => {
      const proposal: Proposal = {status: {Executed: null}} as unknown as Proposal;
      mockActor.get_proposal.mockResolvedValue([proposal]);

      const result = await getProposal({cdn, proposalId: 7n});

      expect(result).toEqual([proposal]);
    });

    it('returns [] when not found', async () => {
      mockActor.get_proposal.mockResolvedValue([]);

      const result = await getProposal({cdn, proposalId: 8n});

      expect(result).toEqual([]);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');

      mockActor.get_proposal.mockRejectedValueOnce(err);

      await expect(getProposal({cdn, proposalId: 9n})).rejects.toThrow(err);
    });
  });
});
