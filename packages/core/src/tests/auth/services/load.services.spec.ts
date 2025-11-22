/**
 * @vitest-environment jsdom
 */

import {AuthClient} from '@icp-sdk/auth/client';
import type {Mock} from 'vitest';
import {mock} from 'vitest-mock-extended';
import {AuthBroadcastChannel} from '../../../auth/providers/_auth-broadcast.providers';
import * as userServices from '../../../auth/services/_user.services';
import {loadAuth, loadAuthWithUser} from '../../../auth/services/load.services';
import {AuthClientStore} from '../../../auth/stores/auth-client.store';
import {AuthStore} from '../../../auth/stores/auth.store';
import {EnvStore} from '../../../core/stores/env.store';
import {mockUser, mockUserIdText} from '../../mocks/core.mock';

vi.mock('@icp-sdk/auth/client', async () => {
  const actual = (await import('@icp-sdk/auth/client')) as typeof import('@icp-sdk/auth/client');

  return {
    ...actual,
    AuthClient: {
      ...actual.AuthClient,
      create: vi.fn()
    }
  };
});

describe('load.services', () => {
  const authClientMock = mock<AuthClient>();

  beforeEach(async () => {
    vi.resetModules();

    (AuthClient.create as Mock).mockResolvedValue(authClientMock);
    vi.spyOn(userServices, 'initUser').mockResolvedValue(mockUser);
    vi.spyOn(userServices, 'loadUser').mockResolvedValue({user: mockUser, userId: mockUserIdText});

    vi.spyOn(AuthBroadcastChannel, 'getInstance').mockReturnValue({
      postLoginSuccess: vi.fn()
    } as unknown as AuthBroadcastChannel);
  });

  afterEach(() => {
    vi.clearAllMocks();
    EnvStore.getInstance().reset();
  });

  describe('loadAuth', () => {
    it('does nothing if not authenticated', async () => {
      authClientMock.isAuthenticated.mockResolvedValue(false);

      await loadAuth();

      expect(authClientMock.isAuthenticated).toHaveBeenCalled();
    });

    it('loads user if authenticated', async () => {
      authClientMock.isAuthenticated.mockResolvedValue(true);

      const authStore = AuthStore.getInstance();
      authStore.reset();

      await loadAuth();

      expect(authClientMock.isAuthenticated).toHaveBeenCalled();
      expect(authStore.get()).not.toBeNull();
    });

    it('should not reset the AuthClient if authenticated', async () => {
      authClientMock.isAuthenticated.mockResolvedValue(true);

      const resetSpy = vi.spyOn(AuthClientStore.getInstance(), 'safeCreateAuthClient');

      await loadAuth();

      expect(resetSpy).not.toHaveBeenCalledTimes(1);
    });

    it('resets the AuthClient when not authenticated', async () => {
      authClientMock.isAuthenticated.mockResolvedValue(false);

      const resetSpy = vi.spyOn(AuthClientStore.getInstance(), 'safeCreateAuthClient');

      await loadAuth();

      expect(resetSpy).toHaveBeenCalledTimes(1);
    });

    it('always re-creates a new AuthClient on every authenticate call', async () => {
      const createSpy = vi.spyOn(AuthClientStore.getInstance(), 'createAuthClient');

      authClientMock.isAuthenticated.mockResolvedValue(true);

      await loadAuth();
      await loadAuth();

      expect(createSpy).toHaveBeenCalledTimes(2);
    });

    it('does not broadcast when syncTabsOnSuccess=false', async () => {
      authClientMock.isAuthenticated.mockResolvedValue(true);

      const postSpy = vi.spyOn(AuthBroadcastChannel.getInstance(), 'postLoginSuccess');

      await loadAuth({syncTabsOnSuccess: false});

      expect(postSpy).not.toHaveBeenCalled();
    });

    it('broadcasts when syncTabsOnSuccess=true', async () => {
      authClientMock.isAuthenticated.mockResolvedValue(true);

      const postSpy = vi.spyOn(AuthBroadcastChannel.getInstance(), 'postLoginSuccess');

      await loadAuth({syncTabsOnSuccess: true});

      expect(postSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadAuthWithUser', () => {
    it('does nothing if not authenticated', async () => {
      const userParam = {...mockUser, key: 'passed-user'};
      const authStore = AuthStore.getInstance();
      authStore.reset();

      authClientMock.isAuthenticated.mockResolvedValue(false);

      const postSpy = vi.spyOn(AuthBroadcastChannel.getInstance(), 'postLoginSuccess');

      await loadAuthWithUser({user: userParam});

      expect(authClientMock.isAuthenticated).toHaveBeenCalled();
      expect(authStore.get()).toBeNull();
      expect(postSpy).not.toHaveBeenCalled();
    });

    it('loads the user passed as parameter when authenticated', async () => {
      const userParam = {...mockUser, key: 'passed-user'};
      const authStore = AuthStore.getInstance();
      authStore.reset();

      authClientMock.isAuthenticated.mockResolvedValue(true);

      const loadUserSpy = vi.spyOn(userServices, 'loadUser');

      await loadAuthWithUser({user: userParam});

      expect(authClientMock.isAuthenticated).toHaveBeenCalled();
      expect(authStore.get()).toEqual(userParam);
      expect(loadUserSpy).not.toHaveBeenCalled();
    });

    it('should not reset the AuthClient if authenticated', async () => {
      authClientMock.isAuthenticated.mockResolvedValue(true);

      const resetSpy = vi.spyOn(AuthClientStore.getInstance(), 'safeCreateAuthClient');

      await loadAuthWithUser({user: mockUser});

      expect(resetSpy).not.toHaveBeenCalled();
    });

    it('resets the AuthClient when not authenticated', async () => {
      authClientMock.isAuthenticated.mockResolvedValue(false);

      const resetSpy = vi.spyOn(AuthClientStore.getInstance(), 'safeCreateAuthClient');

      await loadAuthWithUser({user: mockUser});

      expect(resetSpy).toHaveBeenCalledTimes(1);
    });

    it('always re-creates a new AuthClient on every authenticate call', async () => {
      const createSpy = vi.spyOn(AuthClientStore.getInstance(), 'createAuthClient');

      authClientMock.isAuthenticated.mockResolvedValue(true);

      await loadAuthWithUser({user: mockUser});
      await loadAuthWithUser({user: mockUser});

      expect(createSpy).toHaveBeenCalledTimes(2);
    });

    it('always broadcasts when authenticated', async () => {
      authClientMock.isAuthenticated.mockResolvedValue(true);

      const postSpy = vi.spyOn(AuthBroadcastChannel.getInstance(), 'postLoginSuccess');

      await loadAuthWithUser({user: mockUser});

      expect(postSpy).toHaveBeenCalledTimes(1);
    });
  });
});
