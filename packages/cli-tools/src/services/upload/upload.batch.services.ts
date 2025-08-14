import {Listr} from 'listr2';
import {relative} from 'node:path';
import type {UploadFiles} from '../../types/deploy';
import type {UploadFilesParams, UploadFilesParamsWithProgress} from '../../types/upload';
import {
  type ExecuteUploadFiles,
  executeUploadFiles,
  prepareFileForUpload
} from './_upload.services';

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
  upload,
  batchSize
}: {
  upload: (params: Pick<UploadFilesParamsWithProgress, 'files' | 'progress'>) => Promise<void>;
} & Omit<UploadFilesParams, 'collection'>) => {
  const uploadFiles: ExecuteUploadFiles = async ({groupFiles, step}) => {
    const totalBatches = Math.ceil(groupFiles.length / batchSize);

    // Execute upload batchSize (default UPLOAD_BATCH_SIZE) files at a time max preventively to not stress too much the network
    for (let i = 0; i < groupFiles.length; i += batchSize) {
      const files = groupFiles.slice(i, i + batchSize);

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

      const initBatch = deferredPromise();
      const commitBatch = deferredPromise();

      const uploadFilesTasks = filesProgress.map(({file, promise}) => ({
        title: `Uploading ${relative(sourceAbsolutePath, file.file)}`,
        task: async () => await promise
      }));

      const batchNumber = Math.floor(i / batchSize) + 1;
      const batchLabel = `[${batchNumber}/${totalBatches}]`;
      const batchType = step === 'alternate' ? '✨' : '📦';

      const tasks = new Listr<void>(
        [
          {
            title: `${batchType} Initializing ${batchLabel}`,
            task: async () => await initBatch.promise
          },
          {
            title: `${batchType} Uploading    ${batchLabel}`,
            // eslint-disable-next-line local-rules/prefer-object-params
            task: (_ctx, task): Listr =>
              task.newListr(uploadFilesTasks, {
                concurrent: true
              })
          },
          {
            title: `${batchType} Committing   ${batchLabel}`,
            task: async () => await commitBatch.promise
          }
        ],
        {concurrent: false}
      );

      // We do not await the run on purpose
      const run = tasks.run();

      await upload({
        files,
        progress: {
          onUploadedFileChunks: (fullPath) => {
            const progress = filesProgress.find((file) => file.paths.fullPath === fullPath);
            progress?.resolve?.();
          },
          onInitiatedBatch: () => initBatch.resolve?.(),
          onCommittedBatch: () => commitBatch.resolve?.()
        }
      });

      // wait for the renderer to flush & close cleanly before next batch
      await run;
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
} & Omit<UploadFilesParamsWithProgress, 'sourceAbsolutePath' | 'batchSize'>): Promise<void> => {
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
