import * as z from 'zod/v4';
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

  /**
   * The timestamp when the config was created.
   * @type {bigint}
   * @optional
   */
  createdAt?: bigint;

  /**
   * The timestamp when the config was last updated.
   * @type {bigint}
   * @optional
   */
  updatedAt?: bigint;

  /**
   * The current version of the config.
   * @type {bigint}
   * @optional
   * @description Must be provided when updating the config to ensure the correct version is being updated.
   */
  version?: bigint;
}
