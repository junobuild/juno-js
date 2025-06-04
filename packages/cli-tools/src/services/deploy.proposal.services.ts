import type {COLLECTION_CDN_RELEASES, COLLECTION_DAPP} from '../constants/deploy.constants';
import type {
  DeployParams,
  DeployResultWithProposal,
  FileAndPaths,
  UploadFileStorage,
  UploadFileWithProposal
} from '../types/deploy';
import type {ProposeChangesParams} from '../types/proposal';
import {proposeChanges} from './proposals.services';
import {uploadFiles} from './upload.services';

export const deployAndProposeChanges = async ({
  deploy: {uploadFile, files, sourceAbsolutePath, collection},
  proposal: {proposalType, autoCommit, ...proposalRest}
}: {
  deploy: Pick<DeployParams<UploadFileWithProposal>, 'uploadFile'> & {
    files: FileAndPaths[];
    sourceAbsolutePath: string;
    collection: typeof COLLECTION_DAPP | typeof COLLECTION_CDN_RELEASES;
  };
  proposal: Omit<ProposeChangesParams, 'executeChanges'>;
}): Promise<DeployResultWithProposal> => {
  const executeChanges = async (proposalId: bigint): Promise<void> => {
    const uploadWithProposalId = (params: UploadFileStorage) =>
      uploadFile({
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
