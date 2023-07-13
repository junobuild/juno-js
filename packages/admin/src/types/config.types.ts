export type StorageConfigSourceGlob = string;

export interface StorageConfigHeader {
  source: StorageConfigSourceGlob;
  headers: [string, string][];
}

export interface StorageConfigRewrite {
  source: StorageConfigSourceGlob;
  destination: string;
}

export interface StorageConfig {
  headers?: StorageConfigHeader[];
  rewrites?: StorageConfigRewrite[];
}

export interface Config {
  storage: StorageConfig;
}
