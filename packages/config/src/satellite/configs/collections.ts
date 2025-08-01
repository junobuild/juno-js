import {type Rule, RuleSchema} from './rules';

/**
 * @see DataStoreCollection
 */
export const DataStoreCollectionSchema = RuleSchema.omit({
  createdAt: true,
  updatedAt: true,
  maxSize: true
});

/**
 * Represents a configuration for a collection of the Satellite Datastore.
 * @typedef {Omit<Rule, 'createdAt' | 'updatedAt' | 'maxSize'>} DataStoreCollection
 */
export type DataStoreCollection = Omit<Rule, 'createdAt' | 'updatedAt' | 'maxSize'>;

/**
 * @see StorageCollection
 */
export const StorageCollectionSchema = RuleSchema.omit({
  createdAt: true,
  updatedAt: true,
  maxCapacity: true
});

/**
 * Represents a configuration for a collection of the Satellite Storage.
 * @typedef {Omit<Rule, 'createdAt' | 'updatedAt' | 'maxCapacity'>} StorageCollection
 */
export type StorageCollection = Omit<Rule, 'createdAt' | 'updatedAt' | 'maxCapacity'>;
