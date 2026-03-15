import ora from 'ora';
import {PRUNE_DEFAULT_BATCH_SIZE} from '../constants/prune.constants';
import {preparePrune as preparePruneServices} from '../services/prune.prepare.services';
import {prune as pruneServices} from '../services/prune.services';
import type {PruneFilesFn, PruneFileStorage, PruneParams, PruneResult} from '../types/prune';

/**
 * Identifies and removes stale assets from a satellite's storage.
 *
 * @param {Object} options
 * @param {PruneParams} options.params - Prune parameters including `dryRun` and `batchSize`.
 * @param {PruneFilesFn} options.pruneFn - Function used to delete the resolved stale assets.
 *
 * @returns {Promise<PruneResult>}
 *   - `{ result: 'skipped' }` when no stale assets are found.
 *   - `{ result: 'simulated', files }` when `dryRun` is true; no files are deleted.
 *   - `{ result: 'pruned', files }` when stale assets are successfully deleted.
 */
export const prune = async ({
  params: {dryRun, batchSize, ...rest},
  pruneFn
}: {
  params: PruneParams;
  pruneFn: PruneFilesFn;
}): Promise<PruneResult> => {
  const prepareResult = await preparePrune(rest);

  if (prepareResult.result === 'skipped') {
    return {result: 'skipped'};
  }

  const {files} = prepareResult;

  // 4. Report
  console.log(`\nFound ${files.length} stale asset(s):`);
  for (const {fullPath} of files) {
    console.log(`  - ${fullPath}`);
  }
  console.log('');

  if (dryRun === true) {
    return {result: 'simulated', files};
  }

  await pruneServices({files, pruneFn, batchSize: batchSize ?? PRUNE_DEFAULT_BATCH_SIZE});

  return {result: 'pruned', files};
};

const preparePrune = async (
  params: Omit<PruneParams, 'dryRun'>
): Promise<{result: 'skipped'} | {result: 'to-prune'; files: PruneFileStorage[]}> => {
  const spinner = ora('Preparing prune...').start();

  try {
    const {files: sourceFiles} = await preparePruneServices(params);

    spinner.stop();

    if (sourceFiles.length === 0) {
      console.log('');
      console.log('👍  No stale assets found. Satellite is already clean.');

      return {result: 'skipped'};
    }

    return {
      result: 'to-prune',
      files: sourceFiles
    };
  } catch (err: unknown) {
    spinner.stop();
    throw err;
  }
};
