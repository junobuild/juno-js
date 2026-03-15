import {nonNullish, notEmptyString} from '@dfinity/utils';
import {readFile} from 'node:fs/promises';
import {basename} from 'node:path';
import type {FileAndPaths, FileDetails, UploadFileStorage} from '../../types/deploy';
import type {UploadFilesParams} from '../../types/upload';
import {splitSourceFiles} from '../../utils/upload.utils';

export const prepareFileForUpload = async ({
  file,
  fullPath,
  collection,
  filePath,
  token,
  description
}: {
  file: FileDetails;
  filePath: string;
} & Pick<
  UploadFileStorage,
  'fullPath' | 'collection' | 'token' | 'description'
>): Promise<UploadFileStorage> => ({
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

export type ExecuteUploadFiles = (params: {
  groupFiles: FileAndPaths[];
  step: 'alternate' | 'source';
}) => Promise<void>;

export const executeUploadFiles = async ({
  files,
  uploadFiles
}: {
  uploadFiles: ExecuteUploadFiles;
} & Pick<UploadFilesParams, 'files'>) => {
  // We upload alternate files first. See comment in splitSourceFiles.
  const [alternateFiles, sourceFiles] = splitSourceFiles(files);
  await uploadFiles({groupFiles: alternateFiles, step: 'alternate'});
  await uploadFiles({groupFiles: sourceFiles, step: 'source'});
};
