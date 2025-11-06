import {isNullish} from '@dfinity/utils';
import {
  AuthClient,
  IdbStorage,
  KEY_STORAGE_DELEGATION,
  KEY_STORAGE_KEY
} from '@icp-sdk/auth/client';
import type {DelegationChain, ECDSAKeyIdentity} from '@icp-sdk/core/identity';

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

  createAuthClient = async (): Promise<AuthClient> => {
    this.#authClient = await AuthClient.create({
      idleOptions: {
        disableIdle: true,
        disableDefaultIdleCallback: true
      }
    });

    return this.#authClient;
  };

  safeCreateAuthClient = async (): Promise<AuthClient> => {
    // Since AgentJS persists the identity key in IndexedDB by default,
    // it can be tampered with and affect the next login with Internet Identity or NFID.
    // To ensure each session starts clean and safe, we clear the stored keys before creating a new AuthClient
    // in case the user is not authenticated.
    const storage = new IdbStorage();
    await storage.remove(KEY_STORAGE_KEY);

    return await this.createAuthClient();
  };

  getAuthClient = (): AuthClient | undefined | null => this.#authClient;

  logout = async (): Promise<void> => {
    await this.#authClient?.logout();

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
  };
}
