import {isNullish, nonNullish, notEmptyString} from '@dfinity/utils';
import Listr from 'listr';
import {readFile} from 'node:fs/promises';
import {basename, relative} from 'node:path';
import {
  type COLLECTION_CDN_RELEASES,
  type COLLECTION_DAPP,
  UPLOAD_BATCH_SIZE
} from '../constants/deploy.constants';
import type {FileAndPaths, FileDetails, UploadFile, UploadFileStorage} from '../types/deploy';

// TODO: rename
export const uploadFilesSingle = async ({
  files: sourceFiles,
  uploadFile,
  sourceAbsolutePath,
  collection
}: {
  uploadFile: UploadFile;
  // TODO: extract interface
  files: FileAndPaths[];
  sourceAbsolutePath: string;
  collection: typeof COLLECTION_DAPP | typeof COLLECTION_CDN_RELEASES;
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
  filePath,
  token,
  description
}: {
  file: FileDetails;
  uploadFile: UploadFile;
  filePath: string;
} & Pick<
  UploadFileStorage,
  'fullPath' | 'collection' | 'token' | 'description'
>): Promise<void> => {
  await uploadFile({
    filename: basename(filePath),
    fullPath,
    data: new Blob([await readFile(file.file)]),
    collection,
    headers: [
      ...(file.mime === undefined ? [] : ([['Content-Type', file.mime]] as Array<[string, string]>))
    ],
    encoding: file.encoding,
    ...(nonNullish(token) && notEmptyString(token) && {token}),
    ...(nonNullish(description) && notEmptyString(description) && {description})
  });
};
