import type {DeployParams, DeployParamsSingle, FilePaths, UploadFileWithProposal} from './deploy';

export type PublishSatelliteWasmParams = {
  upload: DeployParamsSingle<UploadFileWithProposal>;
} & Pick<DeployParams, 'assertMemory'> &
  FilePaths & {sourceAbsolutePath: string};
