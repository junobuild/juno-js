import type {CliConfig} from '@junobuild/config';
import type {Asset} from '@junobuild/storage';

export interface PrepareAssetsOptions {
  assertSourceDirExists?: (source: string) => void;
}

export type ListAssets = ({startAfter}: {startAfter?: string}) => Promise<Asset[]>;

export interface AssetsParams {
  config: CliConfig;
  listAssets: ListAssets;
}
