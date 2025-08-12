import {isNullish, nonNullish} from '@dfinity/utils';
import {
  type COLLECTION_CDN_RELEASES,
  type COLLECTION_DAPP,
  UPLOAD_BATCH_SIZE
} from '../../constants/deploy.constants';
import type {FileAndPaths, UploadFiles} from '../../types/deploy';
import {prepareFileForUpload} from './_upload.services';

export const uploadFilesWithBatch = async ({
  files: sourceFiles,
  uploadFiles,
  sourceAbsolutePath,
  collection
}: {
  files: FileAndPaths[];
  uploadFiles: UploadFiles;
  sourceAbsolutePath: string;
  collection: typeof COLLECTION_DAPP | typeof COLLECTION_CDN_RELEASES;
}) => {
  const upload = async (files: FileAndPaths[]): Promise<void> => {
    await uploadFilesToStorage({
      collection,
      files,
      uploadFiles
    });
  };

  await batchUploadFiles({
    files: sourceFiles,
    sourceAbsolutePath,
    upload
  });
};

const batchUploadFiles = async ({
  files: sourceFiles,
  sourceAbsolutePath,
  upload
}: {
  files: FileAndPaths[];
  sourceAbsolutePath: string;
  upload: (params: FileAndPaths[]) => Promise<void>;
}) => {
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

  // TODO: temporary possible race condition fix until Satellite v0.0.13 is published
  // We must upload the alternative path first to ensure . Friday Oct. 10 2023 I got unexpected race condition while uploading the Astro sample example (file hoisted.8961d9b1.js).

  // TODO duplicated code
  await uploadFiles(sourceFiles.filter(({file: {alternateFile}}) => nonNullish(alternateFile)));
  await uploadFiles(sourceFiles.filter(({file: {alternateFile}}) => isNullish(alternateFile)));
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
