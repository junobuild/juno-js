import {Listr} from 'listr2';
import type {PruneFilesFn, PruneFileStorage, PruneParams} from '../types/prune';

export const prune = async ({
  files: groupFiles,
  pruneFn,
  batchSize
}: {
  files: PruneFileStorage[];
  pruneFn: PruneFilesFn;
} & Required<Pick<PruneParams, 'batchSize'>>) => {
  const totalBatches = Math.ceil(groupFiles.length / batchSize);

  // Execute prune with batchSize (default PRUNE_DEFAULT_BATCH_SIZE) files at a time max preventively to not stress too much the network
  for (let i = 0; i < groupFiles.length; i += batchSize) {
    const files = groupFiles.slice(i, i + batchSize);

    const batchNumber = Math.floor(i / batchSize) + 1;
    const batchLabel = `[${batchNumber}/${totalBatches}]`;

    const tasks = new Listr<void>(
      [
        {
          title: `🗑️  Pruning assets ${batchLabel}`,
          task: async () => await pruneFn({files})
        }
      ],
      {concurrent: false}
    );

    await tasks.run();
  }

  console.log(`\n✔ ${groupFiles.length} stale asset(s) pruned.`);
};
