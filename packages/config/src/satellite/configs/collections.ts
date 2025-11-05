import * as z from 'zod';
import {type Rule, RuleSchema} from './rules';

/**
 * @see DatastoreCollection
 */
export const DatastoreCollectionSchema = RuleSchema.omit({
  createdAt: true,
  updatedAt: true,
  maxSize: true
});

/**
 * Represents a configuration for a collection of the Satellite Datastore.
 * @typedef {Omit<Rule, 'createdAt' | 'updatedAt' | 'maxSize'>} DatastoreCollection
 */
export type DatastoreCollection = Omit<Rule, 'createdAt' | 'updatedAt' | 'maxSize'>;

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

/**
 * @see Collections
 */
export const CollectionsSchema = z.strictObject({
  datastore: z.array(DatastoreCollectionSchema).optional(),
  storage: z.array(StorageCollectionSchema).optional()
});

/**
 * Represents the configuration for all the collections of a Satellite.
 * @interface Collections
 */
export interface Collections {
  /**
   * An optional array that defines the collections of the Datastore.
   * @type {DatastoreCollection[]}
   * @optional
   */
  datastore?: DatastoreCollection[];

  /**
   * An optional array that defines the collections of the Storage.
   * @type {StorageCollection[]}
   * @optional
   */
  storage?: StorageCollection[];
}
