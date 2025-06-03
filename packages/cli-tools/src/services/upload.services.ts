import {isNullish, nonNullish, notEmptyString} from '@dfinity/utils';
import {Blob} from 'buffer';
import Listr from 'listr';
import {readFile} from 'node:fs/promises';
import {basename, relative} from 'node:path';
import {
  type COLLECTION_CDN,
  type COLLECTION_DAPP,
  UPLOAD_BATCH_SIZE
} from '../constants/deploy.constants';
import type {FileAndPaths, FileDetails, UploadFile, UploadFileStorage} from '../types/deploy';
import {formatBytes} from '../utils/format.utils';
import {fileSizeInBytes} from '../utils/fs.utils';

export const uploadFiles = async ({
  files: sourceFiles,
  uploadFile,
  sourceAbsolutePath,
  collection
}: {
  files: FileAndPaths[];
  uploadFile: UploadFile;
  sourceAbsolutePath: string;
  collection: typeof COLLECTION_DAPP | typeof COLLECTION_CDN;
}) => {
  const upload = async ({file, paths}: FileAndPaths): Promise<void> => {
    await uploadFileToStorage({
      collection,
      ...paths,
      file,
      uploadFile
    });
  };

  await batchUploadFiles({
    files: sourceFiles,
    sourceAbsolutePath,
    upload
  });

  logSuccess({files: sourceFiles});
};

const logSuccess = ({files}: {files: FileAndPaths[]}) => {
  const {count, size} = files.reduce(
    ({count, size}, {paths}) => ({
      count: count + 1,
      size: size + fileSizeInBytes(paths.filePath)
    }),
    {count: 0, size: 0}
  );

  console.log(`\n✔ ${count} files uploaded (total: ${formatBytes(size)})`);
};

const batchUploadFiles = async ({
  files: sourceFiles,
  sourceAbsolutePath,
  upload
}: {
  files: FileAndPaths[];
  sourceAbsolutePath: string;
  upload: (params: FileAndPaths) => Promise<void>;
}) => {
  const uploadFiles = async (groupFiles: FileAndPaths[]) => {
    // Execute upload UPLOAD_BATCH_SIZE files at a time max preventively to not stress too much the network
    for (let i = 0; i < groupFiles.length; i += UPLOAD_BATCH_SIZE) {
      const files = groupFiles.slice(i, i + UPLOAD_BATCH_SIZE);

      const tasks = new Listr<void>(
        files.map(({file, paths}) => ({
          title: `Uploading ${relative(sourceAbsolutePath, file.file)}`,
          task: async () => await upload({file, paths})
        })),
        {concurrent: true}
      );

      await tasks.run();
    }
  };

  // TODO: temporary possible race condition fix until Satellite v0.0.13 is published
  // We must upload the alternative path first to ensure . Friday Oct. 10 2023 I got unexpected race condition while uploading the Astro sample example (file hoisted.8961d9b1.js).
  await uploadFiles(sourceFiles.filter(({file: {alternateFile}}) => nonNullish(alternateFile)));
  await uploadFiles(sourceFiles.filter(({file: {alternateFile}}) => isNullish(alternateFile)));
};

const uploadFileToStorage = async ({
  uploadFile,
  file,
  fullPath,
  collection,
  filePath
}: {
  file: FileDetails;
  uploadFile: UploadFile;
  filePath: string;
} & Pick<UploadFileStorage, 'fullPath' | 'collection'>): Promise<void> => {
  await uploadFile({
    filename: basename(filePath),
    fullPath,
    data: new Blob([await readFile(file.file)]),
    collection,
    headers: [
      ...(file.mime === undefined ? [] : ([['Content-Type', file.mime]] as Array<[string, string]>))
    ],
    encoding: file.encoding,
    ...(nonNullish(file.token) && notEmptyString(file.token) && {token: file.token}),
    ...(nonNullish(file.description) &&
      notEmptyString(file.description) && {description: file.description})
  });
};
