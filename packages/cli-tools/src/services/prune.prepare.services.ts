import type {Asset} from '@junobuild/storage';
import {join} from 'node:path';
import {DEPLOY_DEFAULT_IGNORE, DEPLOY_DEFAULT_SOURCE} from '../constants/deploy.constants';
import type {ListAssets} from '../types/assets';
import type {DeployConfig} from '../types/config';
import type {PreparePruneOptions, PruneFileStorage} from '../types/prune';
import {listSourceFilesForPrune} from '../utils/prune.utils';

export const preparePrune = async ({
  config,
  listAssets,
  assertSourceDirExists
}: {
  config: DeployConfig;
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
  const stale = existingAssets.filter(({fullPath}) => !localPaths.has(fullPath));

  // Workaround: ic-domains and ii-alternative-origins should not be deleted
  // @see https://github.com/junobuild/juno/issues/2686
  return stale.filter(
    ({fullPath}) =>
      !['/.well-known/ic-domains', '/.well-known/ii-alternative-origins'].includes(fullPath)
  );
};
