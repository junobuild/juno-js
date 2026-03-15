import type {EncodingType} from '@junobuild/config';
import type {OnUploadProgress} from '@junobuild/storage';
import type {AssetsParams, FileDetails, PrepareAssetsOptions} from './assets';

export type FilePaths = Required<Pick<UploadFileStorage, 'fullPath'>> & {
  filePath: string;
};

export interface FileAndPaths {
  file: FileDetails;
  paths: FilePaths;
}

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

export interface UploadFilesStorageWithProposal {
  files: UploadFileStorage[];
  proposalId: bigint;
}

export type UploadFiles = (
  params: {files: UploadFileStorage[]} & OnUploadProgress
) => Promise<void>;
export type UploadFilesWithProposal = (params: UploadFilesStorageWithProposal) => Promise<void>;

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

export interface PrepareDeployOptions extends PrepareAssetsOptions {
  includeAllFiles?: boolean;
}

export type DeployParams = PrepareDeployOptions &
  AssetsParams & {
    assertMemory: () => Promise<void>;
    uploadBatchSize?: number;
  };

export interface UploadIndividually<T = UploadFile> {
  uploadFile: T;
}

export interface UploadWithBatch<T = UploadFiles> {
  uploadFiles: T;
}
