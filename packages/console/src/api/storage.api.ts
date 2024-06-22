import {uploadAsset as uploadAssetStorage, type UploadAsset} from '@junobuild/storage';
import type {
  _SERVICE as ConsoleActor,
  InitAssetKey,
  InitUploadResult
} from '../../declarations/console/console.did';

export const uploadAsset = async ({
  actor,
  proposalId,
  ...asset
}: UploadAsset & {actor: ConsoleActor; proposalId: bigint}): Promise<void> => {
  const init_asset_upload = async (initAssetKey: InitAssetKey): Promise<InitUploadResult> => {
    return await actor.init_asset_upload(initAssetKey, proposalId);
  };

  await uploadAssetStorage({
    actor,
    asset,
    init_asset_upload
  });
};
