import type {CdnParameters} from '../types/actor.params';
import type {CommitProposal, Proposal, ProposalId, ProposalType} from '../types/cdn';
import {getCdnActor} from './_actor.api';

export const initProposal = async ({
  cdn,
  proposalType
}: {
  proposalType: ProposalType;
  cdn: CdnParameters;
}): Promise<[ProposalId, Proposal]> => {
  const {init_proposal} = await getCdnActor(cdn);
  return init_proposal(proposalType);
};

export const submitProposal = async ({
  cdn,
  proposalId
}: {
  cdn: CdnParameters;
  proposalId: ProposalId;
}): Promise<[ProposalId, Proposal]> => {
  const {submit_proposal} = await getCdnActor(cdn);
  return submit_proposal(proposalId);
};

export const commitProposal = async ({
  cdn,
  commitProposal
}: {
  cdn: CdnParameters;
  commitProposal: CommitProposal;
}): Promise<void> => {
  const {commit_proposal} = await getCdnActor(cdn);
  await commit_proposal(commitProposal);
};

export const deleteProposalAssets = async ({
  cdn,
  proposalIds
}: {
  cdn: CdnParameters;
  proposalIds: ProposalId[];
}): Promise<void> => {
  const {delete_proposal_assets} = await getCdnActor(cdn);
  await delete_proposal_assets({proposal_ids: proposalIds});
};
