import type {MaxMemorySizeConfig} from '../../../shared/feature.config';

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
