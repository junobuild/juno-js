import {isNullish, nonNullish} from '@junobuild/utils';
import {Blob} from 'buffer';
import Listr from 'listr';
import {readFile} from 'node:fs/promises';
import {basename, relative} from 'node:path';
import {COLLECTION_DAPP, UPLOAD_BATCH_SIZE} from '../constants/deploy.constants';
import type {FileDetails, UploadFile} from '../types/deploy';
import {fullPath} from '../utils/deploy.utils';

export const upload = async ({
  files: sourceFiles,
  sourceAbsolutePath,
  uploadFile
}: {
  files: FileDetails[];
  sourceAbsolutePath: string;
  uploadFile: UploadFile;
}) => {
  const fileDetailsPath = (file: FileDetails): string => file.alternateFile ?? file.file;

  const upload = async (file: FileDetails): Promise<void> => {
    const filePath = fileDetailsPath(file);

    await uploadFile({
      filename: basename(filePath),
      fullPath: fullPath({file: filePath, sourceAbsolutePath}),
      data: new Blob([await readFile(file.file)]),
      collection: COLLECTION_DAPP,
      headers: [
        ...(file.mime === undefined
          ? []
          : ([['Content-Type', file.mime]] as Array<[string, string]>))
      ],
      encoding: file.encoding
    });
  };

  const uploadFiles = async (groupFiles: FileDetails[]) => {
    // Execute upload UPLOAD_BATCH_SIZE files at a time max preventively to not stress too much the network
    for (let i = 0; i < groupFiles.length; i += UPLOAD_BATCH_SIZE) {
      const files = groupFiles.slice(i, i + UPLOAD_BATCH_SIZE);

      const tasks = new Listr<void>(
        files.map((file) => ({
          title: `Uploading ${relative(sourceAbsolutePath, file.file)}`,
          task: async () => await upload(file)
        })),
        {concurrent: true}
      );

      await tasks.run();
    }
  };

  // TODO: temporary possible race condition fix until Satellite v0.0.13 is published
  // We must upload the alternative path first to ensure . Friday Oct. 10 2023 I got unexpected race condition while uploading the Astro sample example (file hoisted.8961d9b1.js).
  await uploadFiles(sourceFiles.filter(({alternateFile}) => nonNullish(alternateFile)));
  await uploadFiles(sourceFiles.filter(({alternateFile}) => isNullish(alternateFile)));
};
