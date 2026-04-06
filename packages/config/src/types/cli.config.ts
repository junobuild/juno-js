import * as z from 'zod';
import {type HostingConfig, HostingConfigSchema} from './hosting.config';
import type {Deprecated} from './utility.types';

const {source, ...rest} = HostingConfigSchema.shape;

/**
 * @see CliConfig
 * @deprecated use HostingConfigSchema
 */
export const CliConfigSchema = z.strictObject({
  source: source.optional(),
  ...rest
});

/**
 * @deprecated use HostingConfig
 */
export type CliConfig = Deprecated<HostingConfig>;
