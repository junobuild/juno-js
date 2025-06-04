import type {DeployParams, FilePaths, UploadFileWithProposal} from './deploy';

export type PublishSatelliteWasmParams = Pick<
  DeployParams<UploadFileWithProposal>,
  'assertMemory' | 'uploadFile'
> &
  FilePaths & {sourceAbsolutePath: string};
