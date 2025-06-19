import {fromNullable, isNullish, uint8ArrayToHexString} from '@dfinity/utils';
import {commitProposal, initProposal, submitProposal} from '@junobuild/cdn';
import type {ProposeChangesParams} from '../types/proposal';

/**
 * Handles a change lifecycle using a proposal workflow, and optionally commits it.
 *
 * This function:
 * 1. Initializes a new change (proposal) in the CDN.
 * 2. Executes the provided `executeChanges` function to upload assets or WASM.
 * 3. If changes were uploaded, submits the proposal.
 * 4. Logs metadata (ID, status, hash).
 * 5. Optionally commits the change if `autoCommit` is `true`.
 *
 * If no changes are detected during deploy, the function exits early.
 *
 * @param {Object} options - The deployment options.
 * @param {ProposalType} options.proposalType - The type of change being proposed (e.g., deploy, upgrade).
 * @param {CdnParameters} options.cdn - Parameters for interacting with the CDN and associated governance.
 * @param {Function} options.executeChanges - A function that performs the actual upload and returns a `DeployResult`.
 *   Receives the generated proposal ID as input.
 * @param {boolean} options.autoCommit - If `true`, the function will also commit the change after submission.
 *
 * @returns {Promise<{proposalId: bigint}>} Resolves once the deployment and optional commit are complete.
 * Returns the proposal ID that was created.
 *
 * @throws {Error} If the SHA256 hash returned from `submitProposal` is `null` or `undefined`.
 */
export const proposeChanges = async ({
  proposalType,
  cdn,
  executeChanges,
  autoCommit
}: ProposeChangesParams): Promise<{proposalId: bigint}> => {
  const [proposalId, _] = await initProposal({proposalType, cdn});

  await executeChanges(proposalId);

  const [__, {sha256: proposalSha256, status}] = await submitProposal({
    cdn,
    proposalId
  });

  const sha256 = fromNullable(proposalSha256);

  console.log('\nChange submitted.\n');
  console.log('🆔 ', Number(proposalId));
  console.log('⏳ ', Object.keys(status)[0] ?? status);

  if (isNullish(sha256)) {
    console.log('❌ Hash undefined. This is unexpected.');
    process.exit(1);
  }

  console.log('🔒 ', uint8ArrayToHexString(sha256));

  if (!autoCommit) {
    return {proposalId};
  }

  await commitProposal({
    proposal: {
      proposal_id: proposalId,
      sha256
    },
    cdn
  });

  console.log(`🎯 Change #${proposalId} applied.`);

  return {proposalId};
};
