import ora from 'ora';
import {preparePrune as preparePruneServices} from '../services/prune.prepare.services';
import {prune as pruneServices} from '../services/prune.services';
import type {PruneFilesFn, PruneFileStorage, PruneParams, PruneResult} from '../types/prune';

export const prune = async ({
  params: {dryRun, ...rest},
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

  if (dryRun === true) {
    return {result: 'simulated', files};
  }

  await pruneServices({files, pruneFn});

  return {result: 'pruned', files};
};

const preparePrune = async (
  params: Omit<PruneParams, 'dryRun'>
): Promise<{result: 'skipped'} | {result: 'to-prune'; files: PruneFileStorage[]}> => {
  const spinner = ora('Preparing deploy...').start();

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
