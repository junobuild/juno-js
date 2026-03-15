import type {AssetsParams, PrepareAssetsOptions} from './assets';
import type {PrepareDeployOptions} from './deploy';

export type PreparePruneOptions = PrepareAssetsOptions;

export type PruneParams = PrepareDeployOptions & AssetsParams & {dryRun?: boolean};

export interface PruneFileStorage {
  fullPath: string;
}

export type PruneFilesFn = (params: {files: PruneFileStorage[]}) => Promise<void>;

export type PruneResult =
  | {result: 'pruned' | 'simulated'; files: PruneFileStorage[]}
  | {result: 'skipped'};
