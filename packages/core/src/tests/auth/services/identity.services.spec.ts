/**
 * @vitest-environment jsdom
 */

import {AuthClient} from '@icp-sdk/auth/client';
import {AnonymousIdentity} from '@icp-sdk/core/agent';
import type {Mock} from 'vitest';
import {mock} from 'vitest-mock-extended';
import * as userServices from '../../../auth/services/_user.services';
import {
  getIdentity,
  getIdentityOnce,
  unsafeIdentity
} from '../../../auth/services/identity.services';
import {loadAuth} from '../../../auth/services/load.services';
import {resetAuth} from '../../../auth/services/sign-out.services';
import {AuthClientStore} from '../../../auth/stores/auth-client.store';
import {AuthStore} from '../../../auth/stores/auth.store';
import {EnvStore} from '../../../core/stores/env.store';
import {ctorReturning} from '../../mocks/auth-client.mocks';
import {mockIdentity, mockUser, mockUserIdText} from '../../mocks/core.mock';

vi.mock('@icp-sdk/auth/client', async () => {
  const actual = (await import('@icp-sdk/auth/client')) as typeof import('@icp-sdk/auth/client');

  return {
    ...actual,
    AuthClient: vi.fn()
  };
});

describe('identity.services', () => {
  const authClientMock = mock<AuthClient>();

  beforeEach(async () => {
    await resetAuth();

    vi.resetModules();

    (AuthClient as unknown as Mock).mockImplementation(ctorReturning(authClientMock));
    vi.spyOn(userServices, 'initUser').mockResolvedValue(mockUser);
    vi.spyOn(userServices, 'loadUser').mockResolvedValue({user: mockUser, userId: mockUserIdText});
  });

  afterEach(() => {
    vi.clearAllMocks();
    EnvStore.getInstance().reset();
  });

  describe('getIdentity', () => {
    it('returns undefined if authClient is null', async () => {
      const identity = await getIdentity();

      expect(identity).toBeUndefined();
    });

    it('returns identity if available', async () => {
      authClientMock.getIdentity.mockResolvedValue(mockIdentity);

      await loadAuth();

      const identity = await getIdentity();

      expect(identity?.getPrincipal().toText()).toBe(mockIdentity.getPrincipal().toText());
    });
  });

  describe('unsafeIdentity', () => {
    const anonymous = new AnonymousIdentity();

    it('returns an identity', async () => {
      authClientMock.getIdentity.mockResolvedValue(anonymous);

      const identity = await unsafeIdentity();

      expect(identity?.getPrincipal().toText()).toBe(anonymous.getPrincipal().toText());
    });

    it('creates authClient if not initialized and returns identity', async () => {
      authClientMock.getIdentity.mockResolvedValue(anonymous);

      const createSpy = vi.spyOn(AuthClientStore.getInstance(), 'createAuthClient');

      const identity = await unsafeIdentity();

      expect(identity?.getPrincipal().toText()).toBe(anonymous.getPrincipal().toText());
      expect(createSpy).toHaveBeenCalled();
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

      authClientMock.isAuthenticated.mockReturnValue(false);

      const identity = await getIdentityOnce();

      expect(identity).toBeNull();
    });

    it('returns identity if authenticated', async () => {
      AuthStore.getInstance().set(mockUser);

      await loadAuth();

      authClientMock.isAuthenticated.mockReturnValue(true);
      authClientMock.getIdentity.mockResolvedValue(mockIdentity);

      const identity = await getIdentityOnce();

      expect(identity?.getPrincipal().toText()).toBe(mockIdentity.getPrincipal().toText());
    });
  });
});
