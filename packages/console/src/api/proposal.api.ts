import type {CommitProposal, Proposal, ProposalType} from '../../declarations/console/console.did';
import type {ConsoleParameters} from '../types/actor.types';
import {getConsoleActor} from './actor.api';

export const initProposal = async ({
  console,
  proposalType
}: {
  console: ConsoleParameters;
  proposalType: ProposalType;
}): Promise<[bigint, Proposal]> => {
  const {init_proposal} = await getConsoleActor(console);
  return init_proposal(proposalType);
};

export const submitProposal = async ({
  console,
  proposalId
}: {
  console: ConsoleParameters;
  proposalId: bigint;
}): Promise<[bigint, Proposal]> => {
  const {submit_proposal} = await getConsoleActor(console);
  return submit_proposal(proposalId);
};

export const commitProposal = async ({
  console,
  commitProposal
}: {
  console: ConsoleParameters;
  commitProposal: CommitProposal;
}): Promise<void> => {
  const {commit_proposal} = await getConsoleActor(console);
  return commit_proposal(commitProposal);
};
