import {
  uploadAssetWithProposal as uploadAssetWithProposalStorage,
  uploadAssetsWithProposal as uploadAssetsWithProposalStorage,
  type UploadAsset,
  type UploadWithProposalParams
} from '@junobuild/storage';
import type {CdnParameters} from '../types/actor.params';
import {getCdnActor} from './_actor.api';

export const uploadAssetWithProposal = async ({
  cdn,
  ...rest
}: {
  asset: UploadAsset;
  cdn: CdnParameters;
} & Omit<UploadWithProposalParams, 'actor'>): Promise<void> => {
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
} & Omit<UploadWithProposalParams, 'actor'>): Promise<void> => {
  const actor = await getCdnActor(cdn);

  await uploadAssetsWithProposalStorage({
    actor,
    ...rest
  });
};
