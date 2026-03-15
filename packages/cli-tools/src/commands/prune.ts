import ora from 'ora';
import type {FileDetails} from '../types/deploy';
import {PruneParams} from '../types/prune';

export const prune = async ({params}: {params: PruneParams}) => {
  const prepareResult = await preparePrune(params);

  if (prepareResult.result === 'skipped') {
    return {result: 'skipped'};
  }
};

const preparePrune = async (params: Omit<PruneParams, 'uploadFn'>): Promise<
  {result: 'skipped'} | {result: 'to-prune'; files: FileDetails[]; sourceAbsolutePath: string}
> => {
  const spinner = ora('Preparing deploy...').start();


};
