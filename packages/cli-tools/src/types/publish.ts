import type {DeployParams, UploadIndividually, FilePaths, UploadFileWithProposal} from './deploy';

export type PublishSatelliteWasmParams = {
  upload: UploadIndividually<UploadFileWithProposal>;
} & Pick<DeployParams, 'assertMemory'> &
  FilePaths & {sourceAbsolutePath: string};
