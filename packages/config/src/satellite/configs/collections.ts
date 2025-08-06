import * as z from 'zod/v4';
import {ConfigNumber, ConfigNumberSchema} from '../../types/config.number';
import {type Rule, RuleSchema} from './rules';

/**
 * @see DatastoreCollection
 */
export const DatastoreCollectionSchema = RuleSchema.omit({
  createdAt: true,
  updatedAt: true,
  version: true,
  maxSize: true,
  maxTokens: true
}).extend({
  maxTokens: ConfigNumberSchema.optional(),
  version: ConfigNumberSchema.optional()
});

/**
 * Represents a configuration for a collection of the Satellite Datastore.
 * @typedef {Omit<Rule, 'createdAt' | 'updatedAt' | 'version' | 'maxSize' | 'maxTokens'> & {
 *   version?: ConfigNumber;
 *   maxTokens?: ConfigNumber;
 * }} DatastoreCollection
 */
export type DatastoreCollection = Omit<
  Rule,
  'createdAt' | 'updatedAt' | 'version' | 'maxSize' | 'maxTokens'
> & {
  version?: ConfigNumber;
  maxTokens?: ConfigNumber;
};

/**
 * @see StorageCollection
 */
export const StorageCollectionSchema = RuleSchema.omit({
  createdAt: true,
  updatedAt: true,
  version: true,
  maxSize: true,
  maxCapacity: true,
  maxTokens: true
}).extend({
  maxSize: ConfigNumberSchema.optional(),
  maxTokens: ConfigNumberSchema.optional(),
  version: ConfigNumberSchema.optional()
});

/**
 * Represents a configuration for a collection of the Satellite Storage.
 * @typedef {Omit<Rule, 'createdAt' | 'updatedAt' | 'version' | 'maxSize | 'maxCapacity' | 'maxTokens'> & {
 *   version?: ConfigNumber;
 *   maxTokens?: ConfigNumber;
 * }} StorageCollection
 */
export type StorageCollection = Omit<
  Rule,
  'createdAt' | 'updatedAt' | 'version' | 'maxSize' | 'maxCapacity' | 'maxTokens'
> & {
  version?: ConfigNumber;
  maxSize?: ConfigNumber;
  maxTokens?: ConfigNumber;
};

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
