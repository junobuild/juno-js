import type {AssetsParams, PrepareAssetsOptions} from './assets';
import type {PrepareDeployOptions} from './deploy';

export type PreparePruneOptions = PrepareAssetsOptions;

export type PruneParams = PrepareDeployOptions & AssetsParams;

export interface PruneFileStorage {
  fullPath: string;
}

export type PruneFilesFn = (params: {files: PruneFileStorage[]}) => Promise<void>;

export type PruneResult = {result: 'pruned'; files: PruneFileStorage[]} | {result: 'skipped'};
