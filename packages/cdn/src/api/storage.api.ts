import {
  uploadAssetWithProposal as uploadAssetWithProposalStorage,
  uploadAssetsWithProposal as uploadAssetsWithProposalStorage,
  type OnUploadProgress,
  type UploadAsset
} from '@junobuild/storage';
import type {CdnParameters} from '../types/actor.params';
import type {ProposalId} from '../types/cdn';
import {getCdnActor} from './_actor.api';

export const uploadAssetWithProposal = async ({
  cdn,
  ...rest
}: {
  asset: UploadAsset;
  cdn: CdnParameters;
  proposalId: ProposalId;
} & OnUploadProgress): Promise<void> => {
  const actor = await getCdnActor(cdn);

  await uploadAssetWithProposalStorage({
    actor,
    ...rest
  });
};

export const uploadAssetsWithProposal = async ({
  cdn,
  ...rest
}: {
  assets: UploadAsset[];
  cdn: CdnParameters;
  proposalId: ProposalId;
} & OnUploadProgress): Promise<void> => {
  const actor = await getCdnActor(cdn);

  await uploadAssetsWithProposalStorage({
    actor,
    ...rest
  });
};
