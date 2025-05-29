import type {ListProposalResults, ListProposalsParams} from '../../declarations/console/console.did';
import type {CdnParameters} from '../types/actor.params';
import type {CommitProposal, Proposal, ProposalId, ProposalType, RejectProposal} from '../types/cdn';
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

export const rejectProposal = async ({
  cdn,
  proposal
}: {
  cdn: CdnParameters;
  proposal: RejectProposal;
}): Promise<void> => {
  const {reject_proposal} = await getCdnActor(cdn);
  await reject_proposal(proposal);
};

export const commitProposal = async ({
  cdn,
  proposal
}: {
  cdn: CdnParameters;
  proposal: CommitProposal;
}): Promise<void> => {
  const {commit_proposal} = await getCdnActor(cdn);
  await commit_proposal(proposal);
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

export const countProposals = async ({cdn}: {cdn: CdnParameters}): Promise<bigint> => {
  const {count_proposals} = await getCdnActor(cdn);
  return count_proposals();
};

export const listProposals = async ({
  cdn,
  filter
}: {
  cdn: CdnParameters;
  filter: ListProposalsParams;
}): Promise<ListProposalResults> => {
  const {list_proposals} = await getCdnActor(cdn);
  return list_proposals(filter);
};
