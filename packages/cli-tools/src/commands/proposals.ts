import {fromNullable, isNullish, uint8ArrayToHexString} from '@dfinity/utils';
import {
  type CdnParameters,
  commitProposal,
  initProposal,
  type ProposalType,
  submitProposal
} from '@junobuild/cdn';
import type {DeployResult} from '../types/deploy';

/**
 * Deploys changes using a proposal-based workflow, optionally try auto-committing the proposal.
 *
 * This function:
 * 1. Initializes a new change (proposal) in the CDN.
 * 2. Executes the provided `deploy` function to upload assets or WASM.
 * 3. If changes were uploaded, submits the proposal.
 * 4. Logs metadata (ID, status, hash).
 * 5. Optionally commits the change if `autoCommit` is `true`.
 *
 * If no changes are detected during deploy, the function exits early.
 *
 * @param {Object} options - The deployment options.
 * @param {ProposalType} options.proposalType - The type of change being proposed (e.g., deploy, upgrade).
 * @param {CdnParameters} options.cdn - Parameters for interacting with the CDN and associated governance.
 * @param {Function} options.deploy - A function that performs the actual upload and returns a `DeployResult`.
 *   Receives the generated proposal ID as input.
 * @param {boolean} options.autoCommit - If `true`, the function will also commit the change after submission.
 *
 * @returns {Promise<void>} Resolves once the deployment and optional commit are complete.
 * Exits the process early if no changes were detected.
 *
 * @throws {Error} If the SHA256 hash returned from `submitProposal` is `null` or `undefined`.
 */
export const deployWithProposal = async ({
  proposalType,
  cdn,
  deploy,
  autoCommit
}: {
  proposalType: ProposalType;
  autoCommit: boolean;
  cdn: CdnParameters;
  deploy: (proposalId: bigint) => Promise<DeployResult>;
}) => {
  const [proposalId, _] = await initProposal({proposalType, cdn});

  const {result: deployResult} = await deploy(proposalId);

  if (deployResult === 'skipped') {
    process.exit(0);
  }

  const [__, {sha256: proposalSha256, status}] = await submitProposal({
    cdn,
    proposalId
  });

  const sha256 = fromNullable(proposalSha256);

  console.log('\nChange submitted.\n');
  console.log('🆔 ', proposalId);
  console.log('⏳ ', status);

  if (isNullish(sha256)) {
    console.log('❌ Hash undefined. This is unexpected.');
    process.exit(1);
  }

  console.log('🔒 ', uint8ArrayToHexString(sha256));

  if (!autoCommit) {
    return;
  }

  await commitProposal({
    commitProposal: {
      proposal_id: proposalId,
      sha256
    },
    cdn
  });

  console.log(`🎯 Change ${proposalId} committed.`);
};
