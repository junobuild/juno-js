import Listr from 'listr';
import {relative} from 'node:path';
import {UPLOAD_BATCH_SIZE} from '../../constants/deploy.constants';
import type {FileAndPaths, UploadFiles} from '../../types/deploy';
import type {UploadFilesParams, UploadFilesParamsWithProgress} from '../../types/upload';
import {executeUploadFiles, prepareFileForUpload} from './_upload.services';

export const uploadFilesWithBatch = async ({
  uploadFiles,
  collection,
  ...rest
}: {
  uploadFiles: UploadFiles;
} & UploadFilesParams) => {
  const upload = async ({
    files,
    progress
  }: Pick<UploadFilesParamsWithProgress, 'files' | 'progress'>): Promise<void> => {
    await uploadFilesToStorage({
      collection,
      files,
      uploadFiles,
      progress
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
  upload
}: {
  upload: (params: Pick<UploadFilesParamsWithProgress, 'files' | 'progress'>) => Promise<void>;
} & Omit<UploadFilesParams, 'collection'>) => {
  const uploadFiles = async (groupFiles: FileAndPaths[]) => {
    // Execute upload UPLOAD_BATCH_SIZE files at a time max preventively to not stress too much the network
    for (let i = 0; i < groupFiles.length; i += UPLOAD_BATCH_SIZE) {
      const files = groupFiles.slice(i, i + UPLOAD_BATCH_SIZE);

      const deferredPromise = (): {
        promise: Promise<void>;
        resolve: (() => void) | undefined;
      } => {
        let resolve: (() => void) | undefined = undefined;
        const promise = new Promise<void>((res) => (resolve = res));
        return {promise, resolve};
      };

      const filesProgress = files.map((file) => ({
        ...file,
        ...deferredPromise()
      }));

      const tasks = new Listr<void>(
        filesProgress.map(({file, promise}) => ({
          title: `Uploading ${relative(sourceAbsolutePath, file.file)}`,
          task: async () => await promise
        })),
        {concurrent: true}
      );

      // We do not await the run on purpose
      tasks.run();

      await upload({
        files,
        progress: {
          onUploadedFileChunks: (fullPath) => {
            const progress = filesProgress.find((file) => file.paths.fullPath === fullPath);
            progress?.resolve?.();
          }
        }
      });
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
  collection,
  progress
}: {
  uploadFiles: UploadFiles;
} & Omit<UploadFilesParamsWithProgress, 'sourceAbsolutePath'>): Promise<void> => {
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
    files: filesToUpload,
    progress
  });
};
