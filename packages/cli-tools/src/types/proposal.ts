import type {CdnParameters, ProposalType} from '@junobuild/cdn';

export interface ProposeChangesParams {
  proposalType: ProposalType;
  autoCommit: boolean;
  cdn: CdnParameters;
  executeChanges: (proposalId: bigint) => Promise<void>;
}
