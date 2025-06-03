import {toNullable} from '@dfinity/utils';
import {COLLECTION_CDN} from '../constants/deploy.constants';
import {deployAndProposeChanges} from '../services/deploy.proposal.services';
import type {DeployResultWithProposal, FileAndPaths} from '../types/deploy';
import type {ProposeChangesParams} from '../types/proposal';
import type {DeploySatelliteWasmParams} from '../types/upgrade';

/**
 * Uploads a Satellite WASM file to the CDN as part of a proposal-based deployment.
 *
 * This function performs a memory check (if provided), packages the WASM file,
 * uploads it to the CDN, and submits a proposal for deployment.
 * Optionally, the proposal can be auto-committed if `autoCommit` is true.
 *
 * @param {Object} options - The deployment and proposal configuration.
 * @param {DeploySatelliteWasmParams} options.deploy - Deployment parameters including the upload function, memory assertion, and file paths.
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
export const deploySatelliteWasmWithProposal = async ({
  deploy: {assertMemory, filePath, fullPath, token, ...restDeploy},
  proposal: {version, ...restProposal}
}: {
  deploy: DeploySatelliteWasmParams;
  proposal: Pick<ProposeChangesParams, 'cdn' | 'autoCommit'> & {version: string};
}): Promise<DeployResultWithProposal> => {
  await assertMemory?.();

  const sourceFiles: FileAndPaths[] = [
    {
      file: {
        file: filePath,
        token
      },
      paths: {
        filePath,
        fullPath
      }
    }
  ];

  const result = await deployAndProposeChanges({
    deploy: {...restDeploy, files: sourceFiles, collection: COLLECTION_CDN},
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
    console.log(`\n📡 Satellite WASM deployed to CDN.`);
  }

  return result;
};
