/**
 * @vitest-environment jsdom
 */

import {AuthClient} from '@icp-sdk/auth/client';
import type {Mock, MockInstance} from 'vitest';
import {mock} from 'vitest-mock-extended';
import * as userServices from '../../../auth/services/_user.services';
import {loadAuth} from '../../../auth/services/load.services';
import {resetAuth, signOut} from '../../../auth/services/sign-out.services';
import {AuthClientStore} from '../../../auth/stores/auth-client.store';
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

describe('sign-out.services', () => {
  const authClientMock = mock<AuthClient>();

  beforeEach(async () => {
    await resetAuth();

    vi.resetModules();

    (AuthClient.create as Mock).mockResolvedValue(authClientMock);
    vi.spyOn(userServices, 'initUser').mockResolvedValue(mockUser);
    vi.spyOn(userServices, 'loadUser').mockResolvedValue({user: mockUser, userId: mockUserIdText});
  });

  afterEach(() => {
    vi.clearAllMocks();
    EnvStore.getInstance().reset();
  });

  describe('signOut', () => {
    let createAuthClientSpy: MockInstance;
    let reloadSpy: MockInstance;

    const original = window.location;

    beforeEach(async () => {
      await loadAuth();

      createAuthClientSpy = vi
        .spyOn(AuthClientStore.getInstance(), 'createAuthClient')
        .mockResolvedValue(authClientMock);

      Object.defineProperty(window, 'location', {
        configurable: true,
        value: {reload: vi.fn()}
      });

      reloadSpy = vi.spyOn(window.location, 'reload');
    });

    afterEach(() => {
      Object.defineProperty(window, 'location', {configurable: true, value: original});

      vi.clearAllMocks();
      vi.resetAllMocks();
    });

    it('should logs out and resets stores', async () => {
      authClientMock.logout.mockResolvedValue();

      await signOut();

      expect(authClientMock.logout).toHaveBeenCalled();
      expect(createAuthClientSpy).toHaveBeenCalled();
      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should not reload window when windowReload is false', async () => {
      authClientMock.logout.mockResolvedValue();

      await signOut({windowReload: false});

      expect(reloadSpy).not.toHaveBeenCalled();
    });

    it('should still recreates auth client when windowReload is false', async () => {
      authClientMock.logout.mockResolvedValue();

      await signOut({windowReload: false});

      expect(createAuthClientSpy).toHaveBeenCalled();
    });

    it('should not reload if resetAuth fails', async () => {
      authClientMock.logout.mockRejectedValue(new Error('logout failed'));

      await expect(signOut()).rejects.toThrow('logout failed');
      expect(createAuthClientSpy).not.toHaveBeenCalled();
      expect(reloadSpy).not.toHaveBeenCalled();
    });

    it('should not reload if createAuthClient fails', async () => {
      authClientMock.logout.mockResolvedValue();
      createAuthClientSpy.mockRejectedValue(new Error('create client failed'));

      await expect(signOut()).rejects.toThrow('create client failed');

      expect(reloadSpy).not.toHaveBeenCalled();
    });
  });
});
