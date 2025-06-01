import {toNullable} from '@dfinity/utils';
import type {CliConfig} from '@junobuild/config';
import {executeHooks} from '../services/deploy.hook.services';
import {prepareDeploy as prepareDeployServices} from '../services/deploy.prepare.services';
import {upload} from '../services/deploy.upload.services';
import {proposeChanges} from '../services/proposals.services';
import type {
  DeployParams,
  DeployResult,
  DeployResultWithProposal,
  FileDetails,
  UploadFileStorage,
  UploadFileWithProposal
} from '../types/deploy';
import type {ProposeChangesParams} from '../types/proposal';

/**
 * Executes all configured pre-deploy hooks defined in the Juno configuration.
 *
 * This function is typically run before uploading or deploying any assets to
 * perform validations, code generation, or other preparatory tasks.
 *
 * @param {Object} options - The function parameters.
 * @param {CliConfig} options.config - The full configuration object containing hook definitions.
 * @returns {Promise<void>} Resolves once all predeploy hooks have been executed.
 */
export const preDeploy = async ({config: {predeploy}}: {config: CliConfig}) => {
  await executeHooks(predeploy);
};

/**
 * Executes all configured post-deploy hooks defined in the Juno configuration.
 *
 * This function is typically run after a successful deployment to perform cleanup,
 * logging, or integration tasks (e.g., sending Slack notifications).
 *
 * @param {Object} options - The function parameters.
 * @param {CliConfig} options.config - The full configuration object containing hook definitions.
 * @returns {Promise<void>} Resolves once all postdeploy hooks have been executed.
 */
export const postDeploy = async ({config: {postdeploy}}: {config: CliConfig}) => {
  await executeHooks(postdeploy);
};

/**
 * Prepares and uploads dapp assets to a satellite.
 *
 * This function handles:
 * 1. Resolving source files to upload.
 * 2. Verifying that enough memory is available (via `assertMemory`).
 * 3. Uploading all valid files using the provided `uploadFile` function.
 *
 * If no files are detected (e.g., all files are unchanged), the deploy is skipped.
 *
 * @param {Object} options - Deployment options.
 * @param {CliConfig} options.config - The CLI configuration object.
 * @param {ListAssets} options.listAssets - A function to list existing files on the target.
 * @param {Function} [options.assertSourceDirExists] - Optional check to ensure source directory exists.
 * @param {Function} options.assertMemory - A function to ensure enough memory is available.
 * @param {UploadFile} options.uploadFile - A function responsible for uploading a single file.
 *
 * @returns {Promise<DeployResult>} An object containing the result of the deploy:
 *   - `skipped` if no files were found.
 *   - `deployed` and a list of uploaded files if the deploy succeeded.
 */
export const deploy = async ({uploadFile, ...rest}: DeployParams): Promise<DeployResult> => {
  const result = await prepareDeploy(rest);

  if (result.result === 'skipped') {
    return {result: 'skipped'};
  }

  const {files, sourceAbsolutePath} = result;

  await upload({
    files,
    sourceAbsolutePath,
    uploadFile
  });

  console.log(`\n🚀 Deploy complete!`);

  return {result: 'deployed', files};
};

/**
 * Prepares and uploads assets as part of a proposal-based workflow.
 *
 * This function:
 * 1. Prepares the list of files to be uploaded.
 * 2. If no files are found (i.e. nothing to upload), the process is skipped.
 * 3. If files exist, uploads them a proposal flow.
 * 4. Optionally commits - apply - the proposal if `autoCommit` is `true`.
 *
 * @param {Object} options - The deployment and proposal options.
 * @param {DeployParams} options.deploy - Deployment-related parameters (file system, memory check, upload function).
 * @param {Object} options.proposal - Proposal-related options.
 * @param {CdnParameters} options.proposal.cdn - Parameters for interacting with the CDN and governance.
 * @param {boolean} options.proposal.autoCommit - If `true`, automatically commits the proposal after submission.
 * @param {boolean} [options.proposal.clearAssets] - Whether to clear existing assets before upload (optional).
 *
 * @returns {Promise<DeployResultWithProposal>} The result of the deployment process:
 *   - `{result: 'skipped'}` if no files were found for upload.
 *   - `{result: 'submitted', files, proposalId}` if the upload and proposal submission succeeded.
 *   - `{result: 'deployed', files, proposalId}` if the upload and proposal was applied automatically committed.
 */
export const deployWithProposal = async ({
  deploy: {uploadFile, ...rest},
  proposal: {clearAssets, autoCommit, ...proposalRest}
}: {
  deploy: DeployParams<UploadFileWithProposal>;
  proposal: Pick<ProposeChangesParams, 'cdn' | 'autoCommit'> & {clearAssets?: boolean};
}): Promise<DeployResultWithProposal> => {
  const result = await prepareDeploy(rest);

  if (result.result === 'skipped') {
    return {result: 'skipped'};
  }

  const {files, sourceAbsolutePath} = result;

  const executeChanges = async (proposalId: bigint): Promise<void> => {
    const uploadWithProposalId = (params: UploadFileStorage) =>
      uploadFile({
        ...params,
        proposalId
      });

    await upload({
      files,
      sourceAbsolutePath,
      uploadFile: uploadWithProposalId
    });
  };

  const {proposalId} = await proposeChanges({
    ...proposalRest,
    autoCommit,
    proposalType: {
      AssetsUpgrade: {
        clear_existing_assets: toNullable(clearAssets)
      }
    },
    executeChanges
  });

  if (!autoCommit) {
    return {result: 'submitted', files, proposalId};
  }

  console.log(`\n🚀 Deploy complete!`);

  return {result: 'deployed', files, proposalId};
};

const prepareDeploy = async ({
  assertMemory,
  ...rest
}: Omit<DeployParams, 'uploadFile'>): Promise<
  {result: 'skipped'} | {result: 'to-deploy'; files: FileDetails[]; sourceAbsolutePath: string}
> => {
  const {files: sourceFiles, sourceAbsolutePath} = await prepareDeployServices(rest);

  if (sourceFiles.length === 0) {
    console.log('⚠️  No file changes detected. Upload skipped.');

    return {result: 'skipped'};
  }

  await assertMemory?.();

  return {
    result: 'to-deploy',
    files: sourceFiles,
    sourceAbsolutePath
  };
};
