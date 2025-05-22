import type * as CdnConsole from '../../declarations/console/console.did';
import type * as CdnMissionControl from '../../declarations/mission_control/mission_control.did';

export type CommitProposal = CdnConsole.CommitProposal | CdnMissionControl.CommitProposal;
export type Proposal = CdnConsole.Proposal | CdnMissionControl.Proposal;
export type ProposalStatus = CdnConsole.ProposalStatus | CdnMissionControl.ProposalStatus;
export type ProposalType = CdnConsole.ProposalType | CdnMissionControl.ProposalType;
export type AssetsUpgradeOptions =
  | CdnConsole.AssetsUpgradeOptions
  | CdnMissionControl.AssetsUpgradeOptions;
export type SegmentsDeploymentOptions =
  | CdnConsole.SegmentsDeploymentOptions
  | CdnMissionControl.SegmentsDeploymentOptions;

export type InitAssetKey = CdnConsole.InitAssetKey | CdnMissionControl.InitAssetKey;
export type InitUploadResult = CdnConsole.InitUploadResult | CdnMissionControl.InitUploadResult;
