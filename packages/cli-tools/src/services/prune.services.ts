import ora from 'ora';
import type {PruneFilesFn, PruneFileStorage} from '../types/prune';

export const prune = async ({
  files,
  pruneFn
}: {
  files: PruneFileStorage[];
  pruneFn: PruneFilesFn;
}) => {
  const deleteSpinner = ora(`Deleting ${files.length} stale asset(s)...`).start();

  try {
    await pruneFn({files});
  } finally {
    deleteSpinner.stop();
  }

  console.log(`\n✔ Pruned ${files.length} stale asset(s).`);
};
