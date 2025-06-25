import * as z from 'zod';
import {type MaxMemorySizeConfig, MaxMemorySizeConfigSchema} from '../../../shared/feature.config';

/**
 * @see DatastoreConfig
 */
export const DatastoreConfigSchema = z.strictObject({
  maxMemorySize: MaxMemorySizeConfigSchema.optional()
});

/**
 * Configures the behavior of the Datastore.
 * @interface DatastoreConfig
 */
export interface DatastoreConfig {
  /**
   * Configuration for maximum memory size limits for the Datastore.
   *
   * This is used to specify optional limits on heap and stable memory for the smart contract.
   * When the limit is reached, the Datastore and smart contract continue to operate normally but reject the creation or updates of documents.
   *
   * If not specified, no memory limits are enforced.
   *
   * @type {MaxMemorySizeConfig}
   * @optional
   */
  maxMemorySize?: MaxMemorySizeConfig;
}
