import {AnonymousIdentity} from '@dfinity/agent';
import {AuthClient} from '@dfinity/auth-client';
import type {Mock, MockInstance} from 'vitest';
import {mock} from 'vitest-mock-extended';
import {
  getIdentity,
  getIdentityOnce,
  initAuth,
  resetAuth,
  signIn,
  signOut,
  unsafeIdentity
} from '../../services/auth.services';
import * as userServices from '../../services/user.services';
import {AuthStore} from '../../stores/auth.store';
import {SignInError, SignInInitError, SignInUserInterruptError} from '../../types/errors';
import * as authUtils from '../../utils/auth.utils';
import {mockIdentity, mockUser} from '../mocks/mocks';

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

describe('auth.services', () => {
  const authClientMock = mock<AuthClient>();

  beforeEach(async () => {
    await resetAuth();

    vi.resetModules();

    (AuthClient.create as Mock).mockResolvedValue(authClientMock);
    vi.spyOn(userServices, 'initUser').mockResolvedValue(mockUser);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initAuth', () => {
    it('does nothing if not authenticated', async () => {
      authClientMock.isAuthenticated.mockResolvedValue(false);

      await initAuth();

      expect(authClientMock.isAuthenticated).toHaveBeenCalled();
    });

    it('initializes user if authenticated', async () => {
      authClientMock.isAuthenticated.mockResolvedValue(true);

      const authStore = AuthStore.getInstance();
      authStore.reset();

      await initAuth();

      expect(authClientMock.isAuthenticated).toHaveBeenCalled();
      expect(authStore.get()).not.toBeNull();
    });
  });

  describe('signIn', () => {
    it('throws SignInInitError if authClient is null', async () => {
      await expect(signIn()).rejects.toThrowError(
        new SignInInitError(
          'No client is ready to perform a sign-in. Have you initialized the Satellite?'
        )
      );
    });

    describe('Initialized', () => {
      beforeEach(async () => {
        await initAuth();
      });

      it('resolves if login succeeds', async () => {
        authClientMock.isAuthenticated.mockResolvedValue(false);
        authClientMock.login.mockImplementation(async (options) => {
          // @ts-ignore
          options?.onSuccess?.();
        });

        await expect(signIn()).resolves.toBeUndefined();
      });

      it('rejects with SignInUserInterruptError if interrupted', async () => {
        authClientMock.isAuthenticated.mockResolvedValue(false);
        authClientMock.login.mockImplementation(async (options) => {
          options?.onError?.('UserInterrupt');
        });

        await expect(signIn()).rejects.toSatisfy((error) => {
          return error instanceof SignInUserInterruptError && error.message === 'UserInterrupt';
        });
      });

      it('rejects with SignInError on generic error', async () => {
        authClientMock.isAuthenticated.mockResolvedValue(false);
        authClientMock.login.mockImplementation(async (options) => {
          options?.onError?.('AnotherError');
        });

        await expect(signIn()).rejects.toSatisfy((error) => {
          return error instanceof SignInError && error.message === 'AnotherError';
        });
      });
    });
  });

  describe('signOut', () => {
    let spy: MockInstance;

    beforeEach(async () => {
      await initAuth();

      spy = vi.spyOn(authUtils, 'createAuthClient').mockResolvedValue(authClientMock);
    });

    it('logs out and resets stores', async () => {
      authClientMock.logout.mockResolvedValue();

      await signOut();

      expect(authClientMock.logout).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getIdentity', () => {
    it('returns undefined if authClient is null', () => {
      const identity = getIdentity();

      expect(identity).toBeUndefined();
    });

    it('returns identity if available', async () => {
      authClientMock.getIdentity.mockReturnValue(mockIdentity);

      await initAuth();

      const identity = getIdentity();

      expect(identity?.getPrincipal().toText()).toBe(mockIdentity.getPrincipal().toText());
    });
  });

  describe('unsafeIdentity', () => {
    const anonymous = new AnonymousIdentity();

    it('returns an identity', async () => {
      authClientMock.getIdentity.mockReturnValue(anonymous);

      const identity = await unsafeIdentity();

      expect(identity?.getPrincipal().toText()).toBe(anonymous.getPrincipal().toText());
    });

    it('creates authClient if not initialized and returns identity', async () => {
      authClientMock.getIdentity.mockReturnValue(anonymous);

      const identity = await unsafeIdentity();

      expect(identity?.getPrincipal().toText()).toBe(anonymous.getPrincipal().toText());
      expect(authUtils.createAuthClient).toHaveBeenCalled();
    });
  });

  describe('getIdentityOnce', () => {
    it('returns null if no user in AuthStore', async () => {
      AuthStore.getInstance().reset();

      const identity = await getIdentityOnce();

      expect(identity).toBeNull();
    });

    it('returns null if not authenticated', async () => {
      AuthStore.getInstance().set(mockUser);

      authClientMock.isAuthenticated.mockResolvedValue(false);

      const identity = await getIdentityOnce();

      expect(identity).toBeNull();
    });

    it('returns identity if authenticated', async () => {
      AuthStore.getInstance().set(mockUser);

      await initAuth();

      authClientMock.isAuthenticated.mockResolvedValue(true);
      authClientMock.getIdentity.mockReturnValue(mockIdentity);

      const identity = await getIdentityOnce();

      expect(identity?.getPrincipal().toText()).toBe(mockIdentity.getPrincipal().toText());
    });
  });
});
