import type {CliConfig, HostingConfig} from '@junobuild/config';

export type DeployConfig = Partial<HostingConfig> | CliConfig;
