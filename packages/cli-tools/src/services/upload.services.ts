import type {COLLECTION_CDN_RELEASES, COLLECTION_DAPP} from '../constants/deploy.constants';
import type {FileAndPaths, UploadFile, UploadFiles} from '../types/deploy';
import {formatBytes} from '../utils/format.utils';
import {fileSizeInBytes} from '../utils/fs.utils';
import {uploadFilesIndividually} from './upload/upload.individual.services';
import {uploadFilesWithBatch} from './upload/upload.batch.services';

// TODO: rename
export const uploadFiles = async ({
  files: sourceFiles,
  uploadFile,
  ...rest
}: {
  files: FileAndPaths[];
  uploadFile: UploadFile;
  sourceAbsolutePath: string;
  collection: typeof COLLECTION_DAPP | typeof COLLECTION_CDN_RELEASES;
}) => {
  // TODO: rename
  await uploadFilesIndividually({files: sourceFiles, uploadFile, ...rest});

  logSuccess({files: sourceFiles});
};

// TODO: rename and maybe move
export const uploadManyFiles = async ({
  files: sourceFiles,
  uploadFiles,
  ...rest
}: {
  files: FileAndPaths[];
  uploadFiles: UploadFiles;
  sourceAbsolutePath: string;
  collection: typeof COLLECTION_DAPP | typeof COLLECTION_CDN_RELEASES;
}) => {
  await uploadFilesWithBatch({files: sourceFiles, uploadFiles, ...rest});

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
