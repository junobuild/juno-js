import {uploadAsset as uploadAssetStorage, type UploadAsset} from '@junobuild/storage';
import type {InitAssetKey, InitUploadResult} from '../../declarations/console/console.did';
import type {ConsoleParameters} from '../types/actor.types';
import {getConsoleActor} from './actor.api';

export const uploadAsset = async ({
  console,
  proposalId,
  asset
}: {
  asset: UploadAsset;
  console: ConsoleParameters;
  proposalId: bigint;
}): Promise<void> => {
  const actor = await getConsoleActor(console);

  const init_asset_upload = async (initAssetKey: InitAssetKey): Promise<InitUploadResult> => {
    return await actor.init_asset_upload(initAssetKey, proposalId);
  };

  await uploadAssetStorage({
    actor,
    asset,
    init_asset_upload
  });
};
