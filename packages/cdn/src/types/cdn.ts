import type {ConsoleDid, SatelliteDid} from '@junobuild/ic-client';

export type CommitProposal = ConsoleDid.CommitProposal | SatelliteDid.CommitProposal;
export type RejectProposal = CommitProposal;

export type ProposalId = bigint;

export type Proposal = ConsoleDid.Proposal | SatelliteDid.Proposal;
export type ProposalStatus = ConsoleDid.ProposalStatus | SatelliteDid.ProposalStatus;
export type ProposalType = ConsoleDid.ProposalType | SatelliteDid.ProposalType;
export type AssetsUpgradeOptions =
  | ConsoleDid.AssetsUpgradeOptions
  | SatelliteDid.AssetsUpgradeOptions;
export type SegmentsDeploymentOptions =
  | ConsoleDid.SegmentsDeploymentOptions
  | SatelliteDid.SegmentsDeploymentOptions;

export type ProposalKey = ConsoleDid.ProposalKey | SatelliteDid.ProposalKey;

export type InitAssetKey = ConsoleDid.InitAssetKey | SatelliteDid.InitAssetKey;
export type InitUploadResult = ConsoleDid.InitUploadResult | SatelliteDid.InitUploadResult;
