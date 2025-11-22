import {fromNullable, isNullish, uint8ArrayToHexString} from '@dfinity/utils';
import {commitProposal, initProposal, submitProposal} from '@junobuild/cdn';
import ora from 'ora';
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
  const init = async (): Promise<{proposalId: bigint}> => {
    const spinner = ora('Opening proposal...').start();

    try {
      const [proposalId, _] = await initProposal({proposalType, cdn});
      return {proposalId};
    } finally {
      spinner.stop();
    }
  };

  const {proposalId} = await init();

  await executeChanges(proposalId);

  const submit = async (): Promise<{sha256: Uint8Array}> => {
    console.log('');
    const spinner = ora('Submitting proposal...').start();

    try {
      const [__, {sha256: proposalSha256, status}] = await submitProposal({
        cdn,
        proposalId
      });

      const sha256 = fromNullable(proposalSha256);

      spinner.stop();

      console.log('Change submitted.\n');
      console.log('🆔 ', Number(proposalId));
      console.log('⏳ ', Object.keys(status)[0] ?? status);

      if (isNullish(sha256)) {
        spinner.stop();

        console.log('❌ Hash undefined. This is unexpected.');
        process.exit(1);
      }

      console.log('🔒 ', uint8ArrayToHexString(sha256));

      return {sha256};
    } catch (err: unknown) {
      spinner.stop();
      throw err;
    }
  };

  const {sha256} = await submit();

  if (!autoCommit) {
    return {proposalId};
  }

  const commit = async () => {
    console.log('');
    const spinner = ora('Committing proposal...').start();

    try {
      await commitProposal({
        proposal: {
          proposal_id: proposalId,
          sha256
        },
        cdn
      });

      spinner.stop();

      console.log(`🎯 Change #${proposalId} applied.`);
    } catch (err: unknown) {
      spinner.stop();
      throw err;
    }
  };

  await commit();

  return {proposalId};
};
