import {
  AuthClient,
  type AuthClientCreateOptions,
  IdbStorage,
  KEY_STORAGE_DELEGATION,
  KEY_STORAGE_KEY
} from '@icp-sdk/auth/client';
import type {DelegationChain, ECDSAKeyIdentity} from '@icp-sdk/core/identity';
import {isNullish} from '@junobuild/utils';

// `@icp-sdk/auth` v7's synchronous `isAuthenticated()` reads a cached delegation
// expiration from this localStorage key (written by `signIn`). It is an internal
// upstream constant not exported by the package. Flows that inject a session
// manually (OpenID redirect, WebAuthn) bypass `signIn`, so we mirror the cache.
// TODO: replace with an upstream helper once one is exposed.
const KEY_STORAGE_EXPIRATION = 'ic-delegation_expiration';

export class AuthClientStore {
  static #instance: AuthClientStore | undefined;

  #authClient: AuthClient | undefined | null;

  private constructor() {}

  static getInstance(): AuthClientStore {
    if (isNullish(this.#instance)) {
      this.#instance = new AuthClientStore();
    }

    return this.#instance;
  }

  // Kept async for backwards-compatible call sites even though v7's constructor
  // is synchronous (see body).
  // eslint-disable-next-line require-await
  createAuthClient = async (
    options?: Pick<
      AuthClientCreateOptions,
      'identityProvider' | 'derivationOrigin' | 'windowOpenerFeatures' | 'openIdProvider'
    >
  ): Promise<AuthClient> => {
    // `@icp-sdk/auth` v7 replaced the async `AuthClient.create()` factory with a
    // synchronous constructor, and moved the provider options (identityProvider,
    // derivationOrigin, windowOpenerFeatures, openIdProvider) from the per-call
    // `login()` to construction time. We keep this method async so callers don't
    // have to change, and forward the provider options supplied at sign-in.
    this.#authClient = new AuthClient({
      idleOptions: {
        disableIdle: true,
        disableDefaultIdleCallback: true
      },
      ...options
    });

    return this.#authClient;
  };

  /**
   * Since icp-js-core persists identity keys in IndexedDB by default,
   * they could be tampered with and affect the next login.
   * To ensure each session starts clean and safe, we clear the stored keys
   * before creating a new AuthClient.
   *
   * We also remove the delegation because `AuthClient.create` does not
   * overwrite or discard an existing delegation — it reads it from storage
   * and pairs it with whatever key is present. Once the key is cleared and
   * a fresh one generated, the old delegation would reference a different
   * public key, producing an ECDSA P256 signature / delegation mismatch.
   */
  safeCreateAuthClient = async (): Promise<AuthClient> => {
    const storage = new IdbStorage();
    await Promise.all([storage.remove(KEY_STORAGE_KEY), storage.remove(KEY_STORAGE_DELEGATION)]);

    return await this.createAuthClient();
  };

  getAuthClient = (): AuthClient | undefined | null => this.#authClient;

  logout = async (): Promise<void> => {
    await this.#authClient?.signOut();

    // `signOut()` clears the cached expiration, but only when an AuthClient
    // exists. Clear it unconditionally so a manually-injected session (which may
    // have set it without an AuthClient instance) is always fully cleared.
    localStorage.removeItem(KEY_STORAGE_EXPIRATION);

    // Reset local object otherwise next sign in (sign in - sign out - sign in) might not work out - i.e. agent-js might not recreate the delegation or identity if not resetted
    // Technically we do not need this since we recreate the agent below. We just keep it to make the reset explicit.
    this.#authClient = null;
  };

  setAuthClientStorage = async ({
    delegationChain,
    sessionKey
  }: {
    delegationChain: DelegationChain;
    sessionKey: ECDSAKeyIdentity;
  }) => {
    const storage = new IdbStorage();

    await Promise.all([
      storage.set(KEY_STORAGE_KEY, sessionKey.getKeyPair()),
      storage.set(KEY_STORAGE_DELEGATION, JSON.stringify(delegationChain.toJSON()))
    ]);

    // Mirror what `signIn` caches so the synchronous `isAuthenticated()` works
    // for sessions injected here (OpenID redirect, WebAuthn): the earliest
    // delegation expiration (in nanoseconds) under KEY_STORAGE_EXPIRATION.
    const earliest = (delegationChain.delegations ?? []).reduce<bigint | null>(
      (min, {delegation: {expiration}}) => (min === null || expiration < min ? expiration : min),
      null
    );

    if (earliest !== null) {
      localStorage.setItem(KEY_STORAGE_EXPIRATION, earliest.toString());
    }
  };
}
