import {toNullable} from '@dfinity/utils';
import {COLLECTION_CDN_RELEASES} from '../constants/deploy.constants';
import {deployAndProposeChanges} from '../services/deploy.proposal.services';
import type {DeployResultWithProposal, FileAndPaths} from '../types/deploy';
import type {ProposeChangesParams} from '../types/proposal';
import type {PublishSatelliteWasmParams} from '../types/publish';

/**
 * Uploads a Satellite WASM file to the CDN as part of a proposal-based deployment.
 *
 * This function performs a memory check (if provided), packages the WASM file,
 * uploads it to the CDN, and submits a proposal for deployment.
 * Optionally, the proposal can be auto-committed if `autoCommit` is true.
 *
 * @param {Object} options - The deployment and proposal configuration.
 * @param {PublishSatelliteWasmParams} options.deploy - Deployment parameters including the upload function, memory assertion, and file paths.
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
    deploy: {...restDeploy, upload, files: sourceFiles, collection: COLLECTION_CDN_RELEASES},
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
