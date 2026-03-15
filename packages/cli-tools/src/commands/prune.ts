import ora from 'ora';
import {PruneParams} from '../types/prune';
import {FileDetails} from "../types/assets";

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
