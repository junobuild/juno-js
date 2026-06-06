/**
 * @vitest-environment jsdom
 */
import {AuthClient, IdbStorage, KEY_STORAGE_KEY} from '@icp-sdk/auth/client';
import {ECDSAKeyIdentity} from '@icp-sdk/core/identity';
import type {Mock} from 'vitest';
import {mock} from 'vitest-mock-extended';
import {AuthClientStore} from '../../../auth/stores/auth-client.store';
import {ctorReturning} from '../../mocks/auth-client.mocks';

vi.mock('@icp-sdk/auth/client', async () => {
  const actual = (await import('@icp-sdk/auth/client')) as typeof import('@icp-sdk/auth/client');
  return {
    ...actual,
    // v7 replaced the `AuthClient.create()` factory with a synchronous constructor.
    AuthClient: vi.fn()
  };
});

describe('auth-client.store', () => {
  const authClientMock = mock<AuthClient>();

  beforeEach(() => {
    (AuthClient as unknown as Mock).mockReset();
    (AuthClient as unknown as Mock).mockImplementation(ctorReturning(authClientMock));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Init', () => {
    it('should be a singleton', () => {
      const a = AuthClientStore.getInstance();
      const b = AuthClientStore.getInstance();
      expect(a).toBe(b);
    });

    it('getAuthClient is undefined before creation', () => {
      const store = AuthClientStore.getInstance();
      expect(store.getAuthClient()).toBeUndefined();
    });
  });

  describe('Usage', () => {
    beforeEach(async () => {
      await AuthClientStore.getInstance().logout();

      const storage = new IdbStorage();
      await storage.remove(KEY_STORAGE_KEY);
    });

    it('createAuthClient passes idle options and caches the client', async () => {
      const store = AuthClientStore.getInstance();

      await store.createAuthClient();

      expect(AuthClient).toHaveBeenCalledWith({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true
        }
      });

      expect(store.getAuthClient()).toBe(authClientMock);
    });

    it('safeCreateAuthClient clears persisted key then creates new client', async () => {
      const store = AuthClientStore.getInstance();

      const sessionKey = await ECDSAKeyIdentity.generate({extractable: false});
      const storage = new IdbStorage();
      await storage.set(KEY_STORAGE_KEY, sessionKey.getKeyPair());

      const removeSpy = vi.spyOn(IdbStorage.prototype, 'remove');

      await store.safeCreateAuthClient();

      expect(AuthClient).toHaveBeenCalledWith({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true
        }
      });

      expect(removeSpy).toHaveBeenCalledWith(KEY_STORAGE_KEY);
      expect(await storage.get(KEY_STORAGE_KEY)).toBeNull();

      expect(store.getAuthClient()).toBe(authClientMock);
    });

    it('logout calls underlying signOut and nullifies the cached client', async () => {
      const store = AuthClientStore.getInstance();

      authClientMock.signOut.mockResolvedValue();

      await store.createAuthClient();
      await store.logout();

      expect(authClientMock.signOut).toHaveBeenCalled();
      expect(store.getAuthClient()).toBeNull();
    });

    it('createAuthClient creates a fresh client each time and updates cache', async () => {
      const store = AuthClientStore.getInstance();

      const client1 = mock<AuthClient>();
      const client2 = mock<AuthClient>();

      (AuthClient as unknown as Mock)
        .mockImplementationOnce(ctorReturning(client1))
        .mockImplementationOnce(ctorReturning(client2));

      await store.createAuthClient();
      expect(store.getAuthClient()).toBe(client1);

      await store.createAuthClient();
      expect(store.getAuthClient()).toBe(client2);

      expect(AuthClient).toHaveBeenCalledTimes(2);
    });
  });
});
