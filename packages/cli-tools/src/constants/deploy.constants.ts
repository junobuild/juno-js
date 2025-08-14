import type {Precompress} from '@junobuild/config';

export const DEPLOY_DEFAULT_SOURCE = 'build';
export const DEPLOY_DEFAULT_IGNORE = [];
export const DEPLOY_DEFAULT_ENCODING = [];
export const DEPLOY_DEFAULT_PRECOMPRESS: Required<Precompress> = {
  pattern: '**/*.+(css|js|mjs|html)',
  mode: 'both',
  algorithm: 'gzip'
};

export const IGNORE_OS_FILES = ['.ds_store', 'thumbs.db'];
export const UPLOAD_DEFAULT_BATCH_SIZE = 20;

export const COLLECTION_DAPP = '#dapp';
export const COLLECTION_CDN_RELEASES = '#_juno/releases';
