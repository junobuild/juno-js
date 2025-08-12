import type {
  DeployResultWithProposal,
  UploadFileStorage,
  UploadFilesWithProposal,
  UploadFileWithProposal,
  UploadIndividually,
  UploadWithBatch
} from '../types/deploy';
import type {ProposeChangesParams} from '../types/proposal';
import {UploadFilesParams} from '../types/upload';
import {proposeChanges} from './proposals.services';
import {uploadFiles} from './upload.services';

export const deployAndProposeChanges = async ({
  deploy: {upload, files, sourceAbsolutePath, collection},
  proposal: {proposalType, autoCommit, ...proposalRest}
}: {
  deploy: {
    upload: UploadIndividually<UploadFileWithProposal> | UploadWithBatch<UploadFilesWithProposal>;
  } & UploadFilesParams;
  proposal: Omit<ProposeChangesParams, 'executeChanges'>;
}): Promise<DeployResultWithProposal> => {
  const executeChanges = async (proposalId: bigint): Promise<void> => {
    if ('uploadFiles' in upload) {
      const uploadFilesWithProposalId = (params: {files: UploadFileStorage[]}) =>
        upload.uploadFiles({
          ...params,
          proposalId
        });

      await uploadFiles({
        files,
        sourceAbsolutePath,
        collection,
        upload: {uploadFiles: uploadFilesWithProposalId}
      });
      return;
    }

    const uploadFileWithProposalId = (params: UploadFileStorage) =>
      upload.uploadFile({
        ...params,
        proposalId
      });

    await uploadFiles({
      files,
      sourceAbsolutePath,
      collection,
      upload: {uploadFile: uploadFileWithProposalId}
    });
  };

  const {proposalId} = await proposeChanges({
    ...proposalRest,
    autoCommit,
    proposalType,
    executeChanges
  });

  if (!autoCommit) {
    return {result: 'submitted', files: files.map((file) => file.file), proposalId};
  }

  return {result: 'deployed', files: files.map((file) => file.file), proposalId};
};
