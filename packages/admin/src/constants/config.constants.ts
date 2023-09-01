import type {StorageConfigRewrite} from '../types/config.types';

export const DEFAULT_CONFIG_REWRITES: StorageConfigRewrite[] = [
  {
    source: '**',
    destination: '/index.html'
  }
];
