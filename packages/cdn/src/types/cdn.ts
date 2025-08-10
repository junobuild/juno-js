import type * as CdnConsole from '@junobuild/ic-client/dist/declarations/console/console.did';
import type * as CdnSatellite from '@junobuild/ic-client/dist/declarations/satellite/satellite.did';

export type CommitProposal = CdnConsole.CommitProposal | CdnSatellite.CommitProposal;
export type RejectProposal = CommitProposal;

export type ProposalId = bigint;

export type Proposal = CdnConsole.Proposal | CdnSatellite.Proposal;
export type ProposalStatus = CdnConsole.ProposalStatus | CdnSatellite.ProposalStatus;
export type ProposalType = CdnConsole.ProposalType | CdnSatellite.ProposalType;
export type AssetsUpgradeOptions =
  | CdnConsole.AssetsUpgradeOptions
  | CdnSatellite.AssetsUpgradeOptions;
export type SegmentsDeploymentOptions =
  | CdnConsole.SegmentsDeploymentOptions
  | CdnSatellite.SegmentsDeploymentOptions;

export type ProposalKey = CdnConsole.ProposalKey | CdnSatellite.ProposalKey;

export type InitAssetKey = CdnConsole.InitAssetKey | CdnSatellite.InitAssetKey;
export type InitUploadResult = CdnConsole.InitUploadResult | CdnSatellite.InitUploadResult;
