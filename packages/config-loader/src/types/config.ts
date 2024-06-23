export type ConfigType = 'ts' | 'js' | 'json';

export type ConfigFilename = `${'juno.'}${'' | 'dev.'}${'config'}`;

export interface PartialConfigFile {
  configPath?: string;
  configType: ConfigType;
}

export type ConfigFile = Required<PartialConfigFile>;
