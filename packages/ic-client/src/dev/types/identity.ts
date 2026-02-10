import type {DelegationChain, DelegationIdentity, ECDSAKeyIdentity} from '@icp-sdk/core/identity';

/**
 * A unique string identifier for a development identity.
 * e.g. "dev" or "david"
 */
export type DevIdentifier = string;

/**
 * Timestamp in milliseconds since Unix epoch.
 * Date objects cannot be persisted in IndexedDB, so we use numeric timestamps.
 */
export type DevIdentifierTimestamp = number;

/**
 * Metadata about a development identifier's usage.
 */
export interface DevIdentifierData {
  /** Timestamp when this identifier was first used */
  createdAt: DevIdentifierTimestamp;
  /** Timestamp when this identifier was last used */
  updatedAt: DevIdentifierTimestamp;
}

/**
 * Parameters for generating an unsafe development identity.
 */
export interface GenerateUnsafeIdentityParams {
  /** Unique identifier string for this dev identity (default: "dev") */
  identifier?: DevIdentifier;
  /** Delegation expiration time in milliseconds (default: 7 days) */
  maxTimeToLiveInMilliseconds?: number;
}

/**
 * Result of generating an unsafe development identity.
 * Contains all components needed for authentication and storage.
 */
export interface GenerateUnsafeIdentityResult {
  /** The delegated identity for making IC calls */
  identity: DelegationIdentity;
  /** The session key (to be stored in IDB for AuthClient compatibility, key KEY_STORAGE_KEY) */
  sessionKey: ECDSAKeyIdentity;
  /** The delegation chain (to be store in IDB for AuthClient compatibility, key KEY_STORAGE_DELEGATION) */
  delegationChain: DelegationChain;
}

/**
 * Parameters for loading development identifiers.
 */
export interface LoadDevIdentifiersParams {
  /** Optional maximum number of identifiers to return */
  limit?: number;
}
