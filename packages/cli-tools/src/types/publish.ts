import type {DeployParams, FilePaths, UploadFileWithProposal, UploadIndividually} from './deploy';

export type PublishSatelliteWasmParams = {
  upload: UploadIndividually<UploadFileWithProposal>;
} & Pick<DeployParams, 'assertMemory'> &
  FilePaths & {sourceAbsolutePath: string};
