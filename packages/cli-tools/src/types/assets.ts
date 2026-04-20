import type {Asset} from '@junobuild/storage';
import type {DeployConfig} from './config';

export interface PrepareAssetsOptions {
  assertSourceDirExists?: (source: string) => void;
}

export type ListAssets = ({startAfter}: {startAfter?: string}) => Promise<Asset[]>;

export interface AssetsParams {
  config: DeployConfig;
  listAssets: ListAssets;
}
