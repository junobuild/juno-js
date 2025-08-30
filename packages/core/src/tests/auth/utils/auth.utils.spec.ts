import {AuthClient, IdbStorage, KEY_STORAGE_KEY} from '@dfinity/auth-client';
import {ECDSAKeyIdentity} from '@dfinity/identity';
import {beforeEach, Mock} from 'vitest';
import {createAuthClient, resetAuthClient} from '../../../auth/utils/auth.utils';

vi.mock('@dfinity/auth-client', async () => {
  const actual = (await import('@dfinity/auth-client')) as typeof import('@dfinity/auth-client');

  return {
    ...actual,
    AuthClient: {
      ...actual.AuthClient,
      create: vi.fn()
    }
  };
});

describe('auth.utils', () => {
  beforeEach(() => {
    (AuthClient.create as Mock).mockResolvedValue({} as AuthClient);
  });

  describe('createAuthClient', () => {
    it('passes the correct idle options to AuthClient.create', async () => {
      await createAuthClient();

      expect(AuthClient.create).toHaveBeenCalledWith({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true
        }
      });
    });
  });

  describe('resetAuthClient', () => {
    it('clears persisted key from IdbStorage and then creates a new AuthClient', async () => {
      const sessionKey = await ECDSAKeyIdentity.generate({extractable: false});

      const idbStorage = new IdbStorage();
      await idbStorage.set(KEY_STORAGE_KEY, sessionKey.getKeyPair());

      const removeSpy = vi.spyOn(IdbStorage.prototype, 'remove');

      await resetAuthClient();

      expect(AuthClient.create).toHaveBeenCalledWith({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true
        }
      });

      expect(removeSpy).toHaveBeenCalledWith(KEY_STORAGE_KEY);

      expect(await idbStorage.get(KEY_STORAGE_KEY)).toBeNull();
    });
  });
});
