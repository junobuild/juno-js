import {toNullable} from '@dfinity/utils';
import {COLLECTION_CDN_RELEASES, UPLOAD_DEFAULT_BATCH_SIZE} from '../constants/deploy.constants';
import {deployAndProposeChanges} from '../services/deploy.proposal.services';
import type {DeployResultWithProposal, FileAndPaths} from '../types/deploy';
import type {ProposeChangesParams} from '../types/proposal';
import type {PublishSatelliteWasmParams} from '../types/publish';

/**
 * Uploads a Satellite WASM file to the CDN as part of a proposal-based deployment.
 *
 * This function:
 * 1. Optionally performs a memory check (via `assertMemory`).
 * 2. Packages the WASM file into the required format.
 * 3. Uploads the file(s) using the provided upload function — which may
 *    perform a batched proposal flow or an individual file flow, depending
 *    on the `upload` implementation.
 * 4. Submits a proposal to deploy the uploaded Satellite WASM.
 * 5. Optionally commits (applies) the proposal if `autoCommit` is `true`.
 *
 * @param {Object} options - The deployment and proposal configuration.
 * @param {PublishSatelliteWasmParams} options.publish - Publication parameters including the upload function,
 * memory assertion, and file paths.
 * @param {Object} options.proposal - Proposal options.
 * @param {CdnParameters} options.proposal.cdn - CDN and governance configuration.
 * @param {boolean} options.proposal.autoCommit - If `true`, the proposal is automatically committed after submission.
 * @param {string} options.proposal.version - The Satellite version to include in the proposal.
 *
 * @returns {Promise<DeployResultWithProposal>} A result object describing the outcome:
 * - `{ result: 'skipped' }` – No files were found to upload.
 * - `{ result: 'submitted', files, proposalId }` – Upload and proposal submission succeeded.
 * - `{ result: 'deployed', files, proposalId }` – Upload succeeded and proposal was auto-committed.
 */
export const publishSatelliteWasmWithProposal = async ({
  publish: {assertMemory, filePath, fullPath, upload, ...restDeploy},
  proposal: {version, ...restProposal}
}: {
  publish: PublishSatelliteWasmParams;
  proposal: Pick<ProposeChangesParams, 'cdn' | 'autoCommit'> & {version: string};
}): Promise<DeployResultWithProposal> => {
  await assertMemory?.();

  const sourceFiles: FileAndPaths[] = [
    {
      file: {
        file: filePath
      },
      paths: {
        filePath,
        fullPath
      }
    }
  ];

  const result = await deployAndProposeChanges({
    deploy: {
      ...restDeploy,
      upload,
      files: sourceFiles,
      collection: COLLECTION_CDN_RELEASES,
      batchSize: UPLOAD_DEFAULT_BATCH_SIZE
    },
    proposal: {
      ...restProposal,
      proposalType: {
        SegmentsDeployment: {
          satellite_version: toNullable(version),
          orbiter: toNullable(),
          mission_control_version: toNullable()
        }
      }
    }
  });

  if (result.result === 'deployed') {
    console.log(`\n📡 Satellite WASM published to CDN.`);
  }

  return result;
};
