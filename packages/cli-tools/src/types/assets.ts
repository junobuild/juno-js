import type {CliConfig, EncodingType} from '@junobuild/config';
import type {Asset} from '@junobuild/storage';

export type MimeType = string;

export type FileExtension = string;

export interface FileDetails {
  file: string;
  // e.g. for index.js.gz -> index.js
  alternateFile?: string;
  encoding?: EncodingType;
  mime?: MimeType;
}

export type ListAssets = ({startAfter}: {startAfter?: string}) => Promise<Asset[]>;

export interface PrepareAssetsOptions {
  assertSourceDirExists?: (source: string) => void;
}

export interface AssetsParams {
  config: CliConfig;
  listAssets: ListAssets;
}
