import type {CliConfig} from '@junobuild/config';
import {prepareDeploy} from '../services/deploy.prepare.services';
import {upload} from '../services/deploy.upload.services';
import type {FileDetails, ListAssets, UploadFile} from '../types/deploy';

export const deploy = async ({
  assertMemory,
  uploadFile,
  ...rest
}: {
  config: CliConfig;
  listAssets: ListAssets;
  assertSourceDirExists?: (source: string) => void;
  assertMemory: () => Promise<void>;
  uploadFile: UploadFile;
}): Promise<{
  sourceFiles: FileDetails[];
  sourceAbsolutePath: string;
}> => {
  const {files: sourceFiles, sourceAbsolutePath} = await prepareDeploy(rest);

  if (sourceFiles.length === 0) {
    console.log('No new files to upload.');

    return {sourceFiles, sourceAbsolutePath};
  }

  await assertMemory?.();

  await upload({
    files: sourceFiles,
    sourceAbsolutePath,
    uploadFile
  });

  console.log(`\n🚀 Deploy complete!`);

  return {sourceFiles, sourceAbsolutePath};
};
