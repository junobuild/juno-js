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
  encodings: Record<EncodingType, AssetEncoding>;
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

// TODO: align interfaces?
export type UploadFile = (params: UploadFileStorage) => Promise<void>;
export type UploadFileWithProposal = (
  params: UploadFileStorage & {proposalId: bigint}
) => Promise<void>;

export type UploadFiles = (params: {files: UploadFileStorage[]}) => Promise<void>;
export type UploadFilesWithProposal = (params: {
  files: UploadFileStorage[];
  proposalId: bigint;
}) => Promise<void>;

export type UploadFn = {uploadFile: UploadFile} | {uploadFiles: UploadFiles};

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

export type DeployParams = PrepareDeployOptions & {
  config: CliConfig;
  listAssets: ListAssets;
  assertMemory: () => Promise<void>;
};

// TODO: better solution?
// TODO: rename
export type DeployParamsSingle<T = UploadFile> = DeployParams & {
  uploadFile: T;
};

export type DeployParamsGrouped<T = UploadFiles> = DeployParams & {
  uploadFiles: T;
};
