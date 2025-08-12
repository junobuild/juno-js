import {nonNullish, notEmptyString} from '@dfinity/utils';
import {readFile} from 'node:fs/promises';
import {basename} from 'node:path';
import type {FileDetails, UploadFileStorage} from '../../types/deploy';

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
