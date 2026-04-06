import {type HostingConfig, HostingConfigSchema} from './hosting.config';
import type {Deprecated} from './utility.types';

/**
 * @see CliConfig
 * @deprecated use HostingConfigSchema
 */
export const CliConfigSchema = HostingConfigSchema;

/**
 * @deprecated use HostingConfig
 */
export type CliConfig = Deprecated<HostingConfig>;
