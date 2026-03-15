import type {CliConfig} from '@junobuild/config';
import type {Asset} from '@junobuild/storage';
import {join} from 'node:path';
import {DEPLOY_DEFAULT_IGNORE, DEPLOY_DEFAULT_SOURCE} from '../constants/deploy.constants';
import type {ListAssets} from '../types/assets';
import type {PreparePruneOptions, PruneFileStorage} from '../types/prune';
import {listSourceFilesForPrune} from '../utils/prune.utils';

export const preparePrune = async ({
  config,
  listAssets,
  assertSourceDirExists
}: {
  config: CliConfig;
  listAssets: ListAssets;
} & PreparePruneOptions): Promise<{files: PruneFileStorage[]}> => {
  const {source = DEPLOY_DEFAULT_SOURCE, ignore = DEPLOY_DEFAULT_IGNORE} = config;

  const sourceAbsolutePath = join(process.cwd(), source);

  assertSourceDirExists?.(sourceAbsolutePath);

  // 1. Scan local build output
  const localPaths = listSourceFilesForPrune({sourceAbsolutePath, ignore});

  const stale = await filterFilesToPrune({localPaths, listAssets});

  return {files: stale.map(({fullPath}) => ({fullPath}))};
};

const filterFilesToPrune = async ({
  localPaths,
  listAssets
}: {
  localPaths: Set<string>;
  listAssets: ListAssets;
}): Promise<Asset[]> => {
  // 2. Fetch all live assets (paginated)
  const existingAssets = await listAssets({});

  // 3. Compute stale = live_assets − local_files
  return existingAssets.filter(({fullPath}) => !localPaths.has(fullPath));
};
