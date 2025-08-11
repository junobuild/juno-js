import type {COLLECTION_CDN_RELEASES, COLLECTION_DAPP} from '../constants/deploy.constants';
import type {
  DeployParamsGrouped,
  DeployParamsSingle,
  DeployResultWithProposal,
  FileAndPaths,
  UploadFileStorage,
  UploadFilesWithProposal,
  UploadFileWithProposal
} from '../types/deploy';
import type {ProposeChangesParams} from '../types/proposal';
import {proposeChanges} from './proposals.services';
import {uploadFilesGrouped} from './upload.files.services';
import {uploadFiles} from './upload.services';

export const deployAndProposeChanges = async ({
  deploy: {upload, files, sourceAbsolutePath, collection},
  proposal: {proposalType, autoCommit, ...proposalRest}
}: {
  deploy: {
    upload:
      | DeployParamsSingle<UploadFileWithProposal>
      | DeployParamsGrouped<UploadFilesWithProposal>;
    files: FileAndPaths[];
    sourceAbsolutePath: string;
    collection: typeof COLLECTION_DAPP | typeof COLLECTION_CDN_RELEASES;
  };
  proposal: Omit<ProposeChangesParams, 'executeChanges'>;
}): Promise<DeployResultWithProposal> => {
  const executeChanges = async (proposalId: bigint): Promise<void> => {
    // TODO: refactor
    if ('uploadFiles' in upload) {
      const uploadWithProposalId = (params: {files: UploadFileStorage[]}) =>
        upload.uploadFiles({
          ...params,
          proposalId
        });

      await uploadFilesGrouped({
        files,
        sourceAbsolutePath,
        collection,
        uploadFiles: uploadWithProposalId
      });
      return;
    }

    const uploadWithProposalId = (params: UploadFileStorage) =>
      upload.uploadFile({
        ...params,
        proposalId
      });

    await uploadFiles({
      files,
      sourceAbsolutePath,
      collection,
      uploadFile: uploadWithProposalId
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
