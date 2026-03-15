import type {AssetsParams, PrepareAssetsOptions} from './assets';
import {PrepareDeployOptions} from './deploy';

export type PreparePruneOptions = PrepareAssetsOptions;

export type PruneParams = PrepareDeployOptions & AssetsParams;