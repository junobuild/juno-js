import {
  type COLLECTION_CDN_RELEASES,
  type COLLECTION_DAPP,
  UPLOAD_BATCH_SIZE
} from '../../constants/deploy.constants';
import type {FileAndPaths, UploadFiles} from '../../types/deploy';
import {UploadFilesParams} from '../../types/upload';
import {executeUploadFiles, prepareFileForUpload} from './_upload.services';

export const uploadFilesWithBatch = async ({
  uploadFiles,
  collection,
  ...rest
}: {
  uploadFiles: UploadFiles;
} & UploadFilesParams) => {
  const upload = async (files: FileAndPaths[]): Promise<void> => {
    await uploadFilesToStorage({
      collection,
      files,
      uploadFiles
    });
  };

  await batchUploadFiles({
    upload,
    ...rest
  });
};

const batchUploadFiles = async ({
  files,
  // TODO: use for on progress
  sourceAbsolutePath: _,
  upload
}: {
  upload: (params: FileAndPaths[]) => Promise<void>;
} & Omit<UploadFilesParams, "collection">) => {
  const uploadFiles = async (groupFiles: FileAndPaths[]) => {
    // Execute upload UPLOAD_BATCH_SIZE files at a time max preventively to not stress too much the network
    for (let i = 0; i < groupFiles.length; i += UPLOAD_BATCH_SIZE) {
      const files = groupFiles.slice(i, i + UPLOAD_BATCH_SIZE);

      await upload(files);

      // TODO: on progress
      // const tasks = new Listr<void>(
      //   files.map(({file, paths}) => ({
      //     title: `Uploading ${relative(sourceAbsolutePath, file.file)}`,
      //     task: async () => await upload({file, paths})
      //   })),
      //   {concurrent: true}
      // );
      //
      // await tasks.run();
    }
  };

  await executeUploadFiles({
    files,
    uploadFiles
  });
};

const uploadFilesToStorage = async ({
  uploadFiles,
  files,
  collection
}: {
  uploadFiles: UploadFiles;
  files: FileAndPaths[];
  collection: typeof COLLECTION_DAPP | typeof COLLECTION_CDN_RELEASES;
}): Promise<void> => {
  const filesToUpload = await Promise.all(
    files.map(
      async ({file, paths}) =>
        await prepareFileForUpload({
          collection,
          ...paths,
          file
        })
    )
  );

  await uploadFiles({
    files: filesToUpload
  });
};
