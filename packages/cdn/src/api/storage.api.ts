import {uploadAsset as uploadAssetStorage, type UploadAsset} from '@junobuild/storage';
import type {CdnParameters} from '../types/actor.params';
import type {InitAssetKey, InitUploadResult} from '../types/cdn';
import {getCdnActor} from './_actor.api';

export const uploadAsset = async ({
  cdn,
  proposalId,
  asset
}: {
  asset: UploadAsset;
  cdn: CdnParameters;
  proposalId: bigint;
}): Promise<void> => {
  const actor = await getCdnActor(cdn);

  const init_asset_upload = async (initAssetKey: InitAssetKey): Promise<InitUploadResult> =>
    await actor.init_asset_upload(initAssetKey, proposalId);

  await uploadAssetStorage({
    actor,
    asset,
    init_asset_upload
  });
};
