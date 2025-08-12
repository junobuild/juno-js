import {
  uploadAssetWithProposal as uploadAssetWithProposalStorage,
  uploadAssetsWithProposal as uploadAssetsWithProposalStorage,
  type UploadAsset
} from '@junobuild/storage';
import type {CdnParameters} from '../types/actor.params';
import type {ProposalId} from '../types/cdn';
import {getCdnActor} from './_actor.api';

export const uploadAssetWithProposal = async ({
  cdn,
  proposalId,
  asset
}: {
  asset: UploadAsset;
  cdn: CdnParameters;
  proposalId: ProposalId;
}): Promise<void> => {
  const actor = await getCdnActor(cdn);

  await uploadAssetWithProposalStorage({
    actor,
    asset,
    proposalId
  });
};

export const uploadAssetsWithProposal = async ({
  cdn,
  proposalId,
  assets
}: {
  assets: UploadAsset[];
  cdn: CdnParameters;
  proposalId: ProposalId;
}): Promise<void> => {
  const actor = await getCdnActor(cdn);

  await uploadAssetsWithProposalStorage({
    actor,
    assets,
    proposalId
  });
};
