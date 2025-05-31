import type {CliConfig, ENCODING_TYPE} from '@junobuild/config';
import type {Blob} from 'buffer';

export type MimeType = string;

export type FileExtension = string;

export interface FileDetails {
  file: string;
  // e.g. for index.js.gz -> index.js
  alternateFile?: string;
  encoding?: ENCODING_TYPE;
  mime?: MimeType;
}

// TODO: we duplicate the types currently to not reference @junobuild/core
export interface AssetEncoding {
  sha256: string;
}

export interface Asset {
  fullPath: string;
  encodings: Record<ENCODING_TYPE, AssetEncoding>;
}

export type ListAssets = ({startAfter}: {startAfter?: string}) => Promise<Asset[]>;

export interface UploadFileStorage {
  filename: string;
  data: Blob;
  collection: string;
  fullPath?: string;
  headers?: [string, string][];
  token?: string;
  encoding?: ENCODING_TYPE;
  description?: string;
}

export type UploadFile = (params: UploadFileStorage) => Promise<void>;

export type DeployResult =
  | {result: 'deployed'; files: Pick<FileDetails, 'file'>[]}
  | {result: 'skipped'};

export type DeployResultWithProposal =
  | DeployResult
  | {
      result: 'submitted';
      files: Pick<FileDetails, 'file'>[];
    };

export interface DeployParams {
  config: CliConfig;
  listAssets: ListAssets;
  assertSourceDirExists?: (source: string) => void;
  assertMemory: () => Promise<void>;
  uploadFile: UploadFile;
}
