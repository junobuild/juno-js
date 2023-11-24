export type StorageConfigSourceGlob = string;

export interface StorageConfigHeader {
  source: StorageConfigSourceGlob;
  headers: [string, string][];
}

export interface StorageConfigRewrite {
  source: StorageConfigSourceGlob;
  destination: string;
}

export interface StorageConfigRedirect {
  source: StorageConfigSourceGlob;
  location: string;
  code: 301 | 302;
}

export interface StorageConfig {
  headers?: StorageConfigHeader[];
  rewrites?: StorageConfigRewrite[];
  redirects?: StorageConfigRedirect[];
  iframe?: 'deny' | 'same-origin' | 'allow-any';
}

export interface Config {
  storage: StorageConfig;
}
