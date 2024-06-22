import type {Proposal, ProposalType} from '../../declarations/console/console.did';
import type {ConsoleParameters} from '../types/actor.types';
import {getConsoleActor} from './actor.api';

export const init_proposal = async ({
  console,
  proposalType
}: {
  console: ConsoleParameters;
  proposalType: ProposalType;
}): Promise<[bigint, Proposal]> => {
  const {init_proposal} = await getConsoleActor(console);
  return init_proposal(proposalType);
};
