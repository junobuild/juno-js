import * as z from 'zod';
import {type HostingConfig, HostingConfigSchema} from './hosting.config';

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
export interface CliConfig {
  /** @deprecated use HostingConfig.source */
  source?: HostingConfig['source'];
  /** @deprecated use HostingConfig.ignore */
  ignore?: HostingConfig['ignore'];
  /** @deprecated use HostingConfig.precompress */
  precompress?: HostingConfig['precompress'];
  /** @deprecated use HostingConfig.encoding */
  encoding?: HostingConfig['encoding'];
  /** @deprecated use HostingConfig.predeploy */
  predeploy?: HostingConfig['predeploy'];
  /** @deprecated use HostingConfig.postdeploy */
  postdeploy?: HostingConfig['postdeploy'];
}
