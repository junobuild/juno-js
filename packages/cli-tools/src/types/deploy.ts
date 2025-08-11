import type {CliConfig, EncodingType} from '@junobuild/config';
import type {Blob} from 'buffer';

export type MimeType = string;

export type FileExtension = string;

export interface FileDetails {
  file: string;
  // e.g. for index.js.gz -> index.js
  alternateFile?: string;
  encoding?: EncodingType;
  mime?: MimeType;
}

export type FilePaths = Required<Pick<UploadFileStorage, 'fullPath'>> & {
  filePath: string;
};

export interface FileAndPaths {
  file: FileDetails;
  paths: FilePaths;
}

// TODO: we duplicate the types currently to not reference @junobuild/core
export interface AssetEncoding {
  sha256: string;
}

export interface Asset {
  fullPath: string;
  encodings: Partial<Record<EncodingType, AssetEncoding>>;
}

export type ListAssets = ({startAfter}: {startAfter?: string}) => Promise<Asset[]>;

export interface UploadFileStorage {
  filename: string;
  data: Blob;
  collection: string;
  fullPath?: string;
  headers?: [string, string][];
  token?: string;
  encoding?: EncodingType;
  description?: string;
}

export type UploadFileStorageWithProposal = UploadFileStorage & {proposalId: bigint};

export type UploadFile = (params: UploadFileStorage) => Promise<void>;
export type UploadFileWithProposal = (params: UploadFileStorageWithProposal) => Promise<void>;

export type DeployResult =
  | {result: 'deployed'; files: Pick<FileDetails, 'file'>[]}
  | {result: 'skipped'};

export type DeployResultWithProposal =
  | {result: 'deployed'; files: Pick<FileDetails, 'file'>[]; proposalId: bigint}
  | {result: 'skipped'}
  | {
      result: 'submitted';
      files: Pick<FileDetails, 'file'>[];
      proposalId: bigint;
    };

export interface PrepareDeployOptions {
  assertSourceDirExists?: (source: string) => void;
  includeAllFiles?: boolean;
}

export type DeployParams<T = UploadFile> = PrepareDeployOptions & {
  config: CliConfig;
  listAssets: ListAssets;
  assertMemory: () => Promise<void>;
  uploadFile: T;
};
