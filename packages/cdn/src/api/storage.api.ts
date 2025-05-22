import {
  uploadAssetWithProposal as uploadAssetWithProposalStorage,
  type UploadAsset
} from '@junobuild/storage';
import type {CdnParameters} from '../types/actor.params';
import {getCdnActor} from './_actor.api';

export const uploadAssetWithProposal = async ({
  cdn,
  proposalId,
  asset
}: {
  asset: UploadAsset;
  cdn: CdnParameters;
  proposalId: bigint;
}): Promise<void> => {
  const actor = await getCdnActor(cdn);

  await uploadAssetWithProposalStorage({
    actor,
    asset,
    proposalId
  });
};
