import * as z from 'zod/v4';
import {type MaxMemorySizeConfig, MaxMemorySizeConfigSchema} from '../../../shared/feature.config';
import {type DataStoreCollection, DataStoreCollectionSchema} from '../../configs/collections';

/**
 * @see DatastoreConfig
 */
export const DatastoreConfigSchema = z.strictObject({
  maxMemorySize: MaxMemorySizeConfigSchema.optional(),
  collections: z.array(DataStoreCollectionSchema).optional(),
  version: z.bigint().optional()
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
   * An optional array that defines the collections of the Datastore.
   * @type {StorageCollection[]}
   * @optional
   */
  collections?: DataStoreCollection[];

  /**
   * The current version of the config.
   *
   * Optional. The CLI will automatically resolve the version and warn you if there's a potential overwrite.
   * You can provide it if you want to manage versioning manually within your config file.
   *
   * @type {bigint}
   * @optional
   */
  version?: bigint;
}
