import type {OnUploadProgress} from '@junobuild/storage';
import type {COLLECTION_CDN_RELEASES, COLLECTION_DAPP} from '../constants/deploy.constants';
import type {FileAndPaths} from './deploy';

export interface UploadFilesParams {
  files: FileAndPaths[];
  sourceAbsolutePath: string;
  collection: typeof COLLECTION_DAPP | typeof COLLECTION_CDN_RELEASES;
}

export type UploadFilesParamsWithProgress = UploadFilesParams & Required<OnUploadProgress>;
