import {
  DelegationChain,
  DelegationIdentity,
  ECDSAKeyIdentity,
  Ed25519KeyIdentity
} from '@icp-sdk/core/identity';
import {clear, createStore, entries, update} from 'idb-keyval';
import {DEFAULT_DEV_DELEGATION_IDENTITY_EXPIRATION_IN_MS} from './_constants';
import {
  UnsafeDevIdentityInvalidIdentifierError,
  UnsafeDevIdentityNotBrowserError,
  UnsafeDevIdentityNotLocalhostError
} from './errors';
import type {
  DevIdentifier,
  DevIdentifierData,
  GenerateUnsafeIdentityParams,
  GenerateUnsafeIdentityResult,
  LoadDevIdentifiersParams
} from './types/identity';

const identifiersIdbStore = createStore('juno-dev-identifiers', 'juno-dev-identifiers-store');

/**
 * Load all development identifiers that have been used for authentication.
 *
 * Returns an array of tuples containing the identifier string and metadata (created/updated timestamps),
 * sorted by most recently used first.
 *
 * @param params - Load parameters
 * @param params.limit - Optional maximum number of identifiers to return
 * @returns Promise resolving to array of [identifier, metadata] tuples sorted by updatedAt descending
 *
 * @example
 * const recent = await loadDevIdentifiers({ limit: 5 });
 * // Returns only the 5 most recently used identifiers
 */
export const loadDevIdentifiers = async ({limit}: LoadDevIdentifiersParams = {}): Promise<
  [DevIdentifier, DevIdentifierData][]
> => {
  const identifiers = await entries<DevIdentifier, DevIdentifierData>(identifiersIdbStore);

  return identifiers.sort(([_, {updatedAt: a}], [__, {updatedAt: b}]) => b - a).slice(0, limit);
};

/**
 * Clear all stored development identifiers from IndexedDB.
 * This removes the history of used identifiers but does not affect AuthClient's stored credentials.
 *
 * @returns Promise that resolves when identifiers are cleared
 */
export const clearDevIdentifiers = () => clear(identifiersIdbStore);

/**
 * Generate an identity for local development with the Internet Computer.
 *
 * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
 * ⚠️ UNSAFE - FOR LOCAL DEVELOPMENT ONLY ⚠️
 * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
 *
 * Returns the identity, session key, and delegation chain.
 * Consumers must handle storage (e.g. for AuthClient compatibility).
 *
 * @param params - Generation parameters
 * @param params.identifier - Unique identifier string for this dev identity (default: "dev")
 * @param params.maxTimeToLiveInMilliseconds - Delegation expiration time in ms (default: 7 days)
 *
 * @returns Promise resolving to object containing identity, sessionKey, and delegationChain
 *
 * @throws {UnsafeDevIdentityNotBrowserError} If called outside browser environment
 * @throws {UnsafeDevIdentityNotLocalhostError} If called outside localhost
 **/
export const generateUnsafeDevIdentity = async ({
  identifier = 'dev',
  maxTimeToLiveInMilliseconds
}: GenerateUnsafeIdentityParams = {}): Promise<GenerateUnsafeIdentityResult> => {
  const isBrowser = (): boolean => typeof window !== `undefined`;

  if (!isBrowser()) {
    throw new UnsafeDevIdentityNotBrowserError();
  }

  const {
    location: {hostname}
  } = window;

  if (!['127.0.0.1', 'localhost'].includes(hostname)) {
    throw new UnsafeDevIdentityNotLocalhostError();
  }

  const generateSeed = (): Uint8Array => {
    if (identifier.length > 32) {
      throw new UnsafeDevIdentityInvalidIdentifierError(identifier.length);
    }

    const encoder = new TextEncoder();
    return encoder.encode(identifier.padEnd(32, '0'));
  };

  const generate = async (): Promise<GenerateUnsafeIdentityResult> => {
    const seedBytes = generateSeed();

    const rootIdentity = Ed25519KeyIdentity.generate(seedBytes);
    const sessionKey = await ECDSAKeyIdentity.generate({
      extractable: false
    });

    const sessionLengthInMilliseconds =
      maxTimeToLiveInMilliseconds ?? DEFAULT_DEV_DELEGATION_IDENTITY_EXPIRATION_IN_MS;

    const chain = await DelegationChain.create(
      rootIdentity,
      sessionKey.getPublicKey(),
      new Date(Date.now() + sessionLengthInMilliseconds)
    );

    const delegatedIdentity = DelegationIdentity.fromDelegation(sessionKey, chain);

    return {
      identity: delegatedIdentity,
      sessionKey,
      delegationChain: chain
    };
  };

  const saveIdentifierUsage = async () => {
    await update(
      identifier,
      (value) => {
        const now = Date.now();

        return {
          createdAt: value?.createdAt ?? now,
          updatedAt: now
        };
      },
      identifiersIdbStore
    );
  };

  const result = await generate();

  await saveIdentifierUsage();

  return result;
};
