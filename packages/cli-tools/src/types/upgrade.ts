import type {DeployParams, FilePaths, UploadFileWithProposal} from './deploy';

export type DeploySatelliteWasmParams = Pick<
  DeployParams<UploadFileWithProposal>,
  'assertMemory' | 'uploadFile'
> &
  FilePaths & {sourceAbsolutePath: string};
