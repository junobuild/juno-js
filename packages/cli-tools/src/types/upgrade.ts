import type {DeployParams, FileDetails, FilePaths, UploadFileWithProposal} from './deploy';

export type DeploySatelliteWasmParams = Pick<
  DeployParams<UploadFileWithProposal>,
  'assertMemory' | 'uploadFile'
> &
  FilePaths &
  Pick<FileDetails, 'token'> & {sourceAbsolutePath: string};
