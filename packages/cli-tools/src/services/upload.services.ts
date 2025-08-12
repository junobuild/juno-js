import type {FileAndPaths, UploadIndividually, UploadWithBatch} from '../types/deploy';
import type {UploadFilesParams} from '../types/upload';
import {formatBytes} from '../utils/format.utils';
import {fileSizeInBytes} from '../utils/fs.utils';
import {uploadFilesWithBatch} from './upload/upload.batch.services';
import {uploadFilesIndividually} from './upload/upload.individual.services';

export const uploadFiles = async ({
  upload,
  files,
  ...rest
}: UploadFilesParams & {
  upload: UploadIndividually | UploadWithBatch;
}) => {
  if ('uploadFiles' in upload) {
    await uploadFilesWithBatch({
      uploadFiles: upload.uploadFiles,
      files,
      ...rest
    });

    logSuccess({files});
    return;
  }

  await uploadFilesIndividually({uploadFile: upload.uploadFile, files, ...rest});

  logSuccess({files});
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
