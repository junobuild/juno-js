/**
 * Represents the permission levels for read and write access.
 * @typedef {'public' | 'private' | 'managed' | 'controllers'} PermissionText
 */
export type PermissionText = 'public' | 'private' | 'managed' | 'controllers';

/**
 * Represents the memory types.
 * @typedef {'heap' | 'stable'} MemoryText
 */
export type MemoryText = 'heap' | 'stable';

/**
 * Represents the types of rules.
 * @typedef {'db' | 'storage'} RulesType
 */
export type RulesType = 'db' | 'storage';

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
  maxSize?: number;

  /**
   * The maximum capacity of the collection.
   * @type {number}
   * @optional
   */
  maxCapacity?: number;

  /**
   * Indicates whether the permissions are mutable.
   * @type {boolean}
   */
  mutablePermissions: boolean;
}
