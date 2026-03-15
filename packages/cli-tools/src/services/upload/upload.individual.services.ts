import {Listr} from 'listr2';
import {relative} from 'node:path';
import type {FileAndPaths, FileDetails, UploadFile, UploadFileStorage} from '../../types/deploy';
import type {UploadFilesParams} from '../../types/upload';
import {
  type ExecuteUploadFiles,
  executeUploadFiles,
  prepareFileForUpload
} from './_upload.services';

export const uploadFilesIndividually = async ({
  uploadFile,
  collection,
  ...rest
}: {
  uploadFile: UploadFile;
} & UploadFilesParams) => {
  const upload = async ({file, paths}: FileAndPaths): Promise<void> => {
    await uploadFileToStorage({
      collection,
      ...paths,
      file,
      uploadFile
    });
  };

  await batchUploadFiles({
    upload,
    ...rest
  });
};

const batchUploadFiles = async ({
  files,
  sourceAbsolutePath,
  upload,
  batchSize
}: {
  upload: (params: FileAndPaths) => Promise<void>;
} & Omit<UploadFilesParams, 'collection'>) => {
  const uploadFiles: ExecuteUploadFiles = async ({groupFiles, step}) => {
    // Execute upload batchSize (default UPLOAD_BATCH_SIZE) files at a time max preventively to not stress too much the network
    for (let i = 0; i < groupFiles.length; i += batchSize) {
      const files = groupFiles.slice(i, i + batchSize);

      const tasks = new Listr<void>(
        files.map(({file, paths}) => ({
          title: `${step === 'alternate' ? '✨' : '📦'} Uploading ${relative(sourceAbsolutePath, file.file)}`,
          task: async () => await upload({file, paths})
        })),
        {concurrent: true}
      );

      await tasks.run();
    }
  };

  await executeUploadFiles({
    files,
    uploadFiles
  });
};

const uploadFileToStorage = async ({
  uploadFile,
  ...rest
}: {
  file: FileDetails;
  uploadFile: UploadFile;
  filePath: string;
} & Pick<
  UploadFileStorage,
  'fullPath' | 'collection' | 'token' | 'description'
>): Promise<void> => {
  const fileToUpload = await prepareFileForUpload(rest);
  await uploadFile(fileToUpload);
};
