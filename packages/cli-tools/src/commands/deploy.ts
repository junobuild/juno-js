import {toNullable} from '@dfinity/utils';
import type {CliConfig} from '@junobuild/config';
import {COLLECTION_DAPP} from '../constants/deploy.constants';
import {executeHooks} from '../services/deploy.hook.services';
import {prepareDeploy as prepareDeployServices} from '../services/deploy.prepare.services';
import {execute} from '../services/deploy.progress.services';
import {deployAndProposeChanges} from '../services/deploy.proposal.services';
import {uploadFiles} from '../services/upload.services';
import type {
  DeployParams,
  DeployResult,
  DeployResultWithProposal,
  FileAndPaths,
  FileDetails,
  FilePaths,
  UploadFilesWithProposal,
  UploadFileWithProposal,
  UploadIndividually,
  UploadWithBatch
} from '../types/deploy';
import {type OnDeployProgress, DeployProgressStep} from '../types/progress';
import type {ProposeChangesParams} from '../types/proposal';
import {fullPath} from '../utils/deploy.utils';

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
 * Steps:
 * 1) Resolve source files to upload.
 * 2) Ensure enough memory is available (via internal checks).
 * 3) Upload files using the provided upload function:
 *    - `UploadWithBatch`: one init+commit for all files (batched).
 *    - `UploadIndividually`: init+commit per file (unbatched).
 *
 * Notes:
 * - Chunk uploading logic is identical in both modes; only init/commit differ.
 * - If no files are detected (e.g. unchanged), the deploy is skipped.
 *
 * @param {Object} options
 * @param {DeployParams} options.params - Deployment parameters (paths, config, etc.).
 * @param {UploadIndividually | UploadWithBatch} options.upload - Upload strategy function.
 *   Pass a function that either uploads files **with batch** (single init/commit)
 *   or **individually** (per-file init/commit).
 * @returns {Promise<DeployResult>}
 *   - `{ result: 'skipped' }` when there are no files to upload.
 *   - `{ result: 'deployed', files }` when the upload completes.
 */
export const deploy = async ({
  params,
  upload,
  onProgress
}: {
  params: DeployParams;
  upload: UploadIndividually | UploadWithBatch;
} & OnDeployProgress): Promise<DeployResult> => {
  const prepareResult = await execute({
    fn: async () => await prepareDeploy({params}),
    onProgress,
    step: DeployProgressStep.PrepareDeploy
  });

  if (prepareResult.result === 'skipped') {
    return {result: 'skipped'};
  }

  const {rawFiles, sourceFiles, sourceAbsolutePath} = prepareResult;

  const source = {
    files: sourceFiles,
    sourceAbsolutePath
  };

  await execute({
    fn: async () => {
      await uploadFiles({
        ...source,
        collection: COLLECTION_DAPP,
        upload
      });
    },
    onProgress,
    step: DeployProgressStep.Deploy
  });

  logDeployComplete();

  return {result: 'deployed', files: rawFiles};
};

/**
 * Prepares and uploads assets through a proposal workflow.
 *
 * Steps:
 * 1) Prepare the list of files to upload.
 * 2) If no files are found, skip.
 * 3) Upload using the selected strategy (batched or per-file).
 * 4) Submit a proposal for the asset upgrade and, if `autoCommit` is true, apply it.
 *
 * Notes:
 * - Chunk uploading is the same across strategies; only init/commit batching differs.
 * - Set `clearAssets` to remove existing assets before upload (proposal field).
 *
 * @param {Object} options
 * @param {Object} options.deploy
 * @param {DeployParams} options.deploy.params - Deployment parameters.
 * @param {UploadIndividually<UploadFileWithProposal> | UploadWithBatch<UploadFilesWithProposal>} options.deploy.upload
 *   Upload strategy function used *within the proposal flow*.
 * @param {Object} options.proposal
 * @param {CdnParameters} options.proposal.cdn - Governance/CDN params.
 * @param {boolean} options.proposal.autoCommit - Apply the proposal automatically after submission.
 * @param {boolean} [options.proposal.clearAssets] - Clear existing assets before upload.
 *
 * @returns {Promise<DeployResultWithProposal>}
 *   - `{ result: 'skipped' }` when there are no files.
 *   - `{ result: 'submitted', files, proposalId }` when proposed but not applied.
 *   - `{ result: 'deployed', files, proposalId }` when proposed and auto-applied.
 */
export const deployWithProposal = async ({
  deploy: {params, upload, onProgress},
  proposal: {clearAssets, ...restProposal}
}: {
  deploy: {
    params: DeployParams;
    upload: UploadIndividually<UploadFileWithProposal> | UploadWithBatch<UploadFilesWithProposal>;
  } & OnDeployProgress;
  proposal: Pick<ProposeChangesParams, 'cdn' | 'autoCommit'> & {clearAssets?: boolean};
}): Promise<DeployResultWithProposal> => {
  const prepareResult = await execute({
    fn: async () => await prepareDeploy({params}),
    onProgress,
    step: DeployProgressStep.PrepareDeploy
  });

  if (prepareResult.result === 'skipped') {
    return {result: 'skipped'};
  }

  const {sourceFiles, sourceAbsolutePath} = prepareResult;

  const result = await execute({
    fn: async () =>
      await deployAndProposeChanges({
        deploy: {upload, files: sourceFiles, sourceAbsolutePath, collection: COLLECTION_DAPP},
        proposal: {
          ...restProposal,
          proposalType: {
            AssetsUpgrade: {
              clear_existing_assets: toNullable(clearAssets)
            }
          }
        }
      }),
    onProgress,
    step: DeployProgressStep.Deploy
  });

  if (result.result === 'deployed') {
    logDeployComplete();
  }

  return result;
};

const prepareDeploy = async ({
  params
}: {
  params: DeployParams;
}): Promise<
  | {result: 'skipped'}
  | {
      result: 'to-deploy';
      rawFiles: FileDetails[];
      sourceFiles: FileAndPaths[];
      sourceAbsolutePath: string;
    }
> => {
  const prepareResult = await prepareDeployFiles(params);

  if (prepareResult.result === 'skipped') {
    return {result: 'skipped'};
  }

  const {files: rawFiles, sourceAbsolutePath} = prepareResult;

  const sourceFiles = prepareSourceFiles(prepareResult);

  return {
    result: 'to-deploy',
    rawFiles,
    sourceFiles,
    sourceAbsolutePath
  };
};

const prepareDeployFiles = async ({
  assertMemory,
  ...rest
}: Omit<DeployParams, 'uploadFn'>): Promise<
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

const prepareSourceFiles = ({
  files,
  sourceAbsolutePath
}: {
  files: FileDetails[];
  sourceAbsolutePath: string;
}): FileAndPaths[] => {
  const filePaths = (file: FileDetails): FilePaths => {
    const filePath = file.alternateFile ?? file.file;

    return {
      fullPath: fullPath({file: filePath, sourceAbsolutePath}),
      filePath
    };
  };

  return files.map((file) => ({file, paths: filePaths(file)}));
};

const logDeployComplete = () => console.log(`\n🚀 Deploy complete!`);
