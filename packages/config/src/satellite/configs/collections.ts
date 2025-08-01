import {type Rule, RuleSchema} from './rules';

/**
 * @see DataStoreCollection
 */
export const DataStoreCollectionSchema = RuleSchema.omit({
  createdAt: true,
  updatedAt: true,
  maxSize: true,
  version: true
});

/**
 * Represents a configuration for a collection of the Satellite Datastore.
 * @typedef {Omit<Rule, 'createdAt' | 'updatedAt' | 'maxSize' | 'version'>} DataStoreCollection
 */
export type DataStoreCollection = Omit<Rule, 'createdAt' | 'updatedAt' | 'maxSize' | 'version'>;

/**
 * @see StorageCollection
 */
export const StorageCollectionSchema = RuleSchema.omit({
  createdAt: true,
  updatedAt: true,
  maxCapacity: true,
  version: true
});

/**
 * Represents a configuration for a collection of the Satellite Storage.
 * @typedef {Omit<Rule, 'createdAt' | 'updatedAt' | 'maxCapacity' | 'version'>} StorageCollection
 */
export type StorageCollection = Omit<Rule, 'createdAt' | 'updatedAt' | 'maxCapacity' | 'version'>;
