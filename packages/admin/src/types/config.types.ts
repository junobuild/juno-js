export interface StorageConfig {
  trailingSlash?: 'always' | 'never';
}

export interface Config {
  storage: StorageConfig;
}
