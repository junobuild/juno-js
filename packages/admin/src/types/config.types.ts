export interface StorageConfigHeaders {
  source: string;
  headers: [string, string][];
}

export interface StorageConfig {
  headers: StorageConfigHeaders[];
}

export interface Config {
  storage: StorageConfig;
}
