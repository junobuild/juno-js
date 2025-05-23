import type {CliConfig} from '@junobuild/config';
import {executeHooks} from '../services/deploy.hook.services';
import {prepareDeploy} from '../services/deploy.prepare.services';
import {upload} from '../services/deploy.upload.services';
import type {DeployResult, ListAssets, UploadFile} from '../types/deploy';

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
export const deploy = async ({
  assertMemory,
  uploadFile,
  ...rest
}: {
  config: CliConfig;
  listAssets: ListAssets;
  assertSourceDirExists?: (source: string) => void;
  assertMemory: () => Promise<void>;
  uploadFile: UploadFile;
}): Promise<DeployResult> => {
  const {files: sourceFiles, sourceAbsolutePath} = await prepareDeploy(rest);

  if (sourceFiles.length === 0) {
    console.log('⚠️ No files detected. Upload skipped.');

    return {result: 'skipped'};
  }

  await assertMemory?.();

  await upload({
    files: sourceFiles,
    sourceAbsolutePath,
    uploadFile
  });

  console.log(`\n🚀 Deploy complete!`);

  return {result: 'deployed', files: sourceFiles};
};
