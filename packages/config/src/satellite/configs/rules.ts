import * as z from 'zod/v4';
import {NumericValueSchema} from '../../types/numeric';

/**
 * @see PermissionText
 */
export const PermissionTextSchema = z.enum(['public', 'private', 'managed', 'controllers']);

/**
 * Represents the permission levels for read and write access.
 * @typedef {'public' | 'private' | 'managed' | 'controllers'} PermissionText
 */
export type PermissionText = 'public' | 'private' | 'managed' | 'controllers';

/**
 * @see MemoryText
 */
export const MemoryTextSchema = z.enum(['heap', 'stable']);

/**
 * Represents the memory types.
 * @typedef {'heap' | 'stable'} MemoryText
 */
export type MemoryText = 'heap' | 'stable';

/**
 * @see RulesType
 */
export const RulesTypeSchema = z.enum(['db', 'storage']);

/**
 * Represents the types of rules.
 * @typedef {'db' | 'storage'} RulesType
 */
export type RulesType = 'db' | 'storage';

/**
 * @see Rule
 */
export const RuleSchema = z.strictObject({
  collection: z.string(),
  read: PermissionTextSchema,
  write: PermissionTextSchema,
  memory: MemoryTextSchema,
  createdAt: NumericValueSchema.optional(),
  updatedAt: NumericValueSchema.optional(),
  version: NumericValueSchema.optional(),
  maxSize: NumericValueSchema.optional(),
  maxChangesPerUser: z.number().optional(),
  maxCapacity: z.number().optional(),
  mutablePermissions: z.boolean().optional().default(true),
  maxTokens: NumericValueSchema.optional()
});

/**
 * Represents a rule configuration for a collection.
 * @interface Rule
 */
export interface Rule {
  /**
   * The name of the collection the rule applies to.
   * @type {string}
   */
  collection: string;

  /**
   * The permission level for read access.
   * @type {PermissionText}
   */
  read: PermissionText;

  /**
   * The permission level for write access.
   * @type {PermissionText}
   */
  write: PermissionText;

  /**
   * The type of memory allocated for the collection.
   * @type {MemoryText}
   */
  memory: MemoryText;

  /**
   * The timestamp when the rule was created.
   * @type {bigint}
   * @optional
   */
  createdAt?: bigint;

  /**
   * The timestamp when the rule was last updated.
   * @type {bigint}
   * @optional
   */
  updatedAt?: bigint;

  /**
   * The version of the rule.
   * @type {bigint}
   * @optional
   * @description Must be provided when updating the rule to ensure the correct version is being updated.
   */
  version?: bigint;

  /**
   * The maximum size of the collection in bytes.
   * @type {number}
   * @optional
   */
  maxSize?: bigint;

  /**
   * The maximum number of changes (create, update or delete) per user for the collection.
   * @type {number}
   * @optional
   */
  maxChangesPerUser?: number;

  /**
   * The maximum capacity of the collection.
   * @type {number}
   * @optional
   */
  maxCapacity?: number;

  /**
   * Indicates whether the permissions are mutable.
   * @default true
   * @type {boolean}
   */
  mutablePermissions?: boolean;

  /**
   * The maximum number of writes and deletes per minute.
   */
  maxTokens?: bigint;
}
