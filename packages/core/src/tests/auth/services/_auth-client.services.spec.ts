import type {AuthClient} from '@icp-sdk/auth/client';
import {mock} from 'vitest-mock-extended';
import {authenticateWithAuthClient} from '../../../auth/services/_auth-client.services';
import {AuthClientStore} from '../../../auth/stores/auth-client.store';

describe('_auth-client.services', () => {
  const authClientMock = mock<AuthClient>();

  beforeEach(() => {
    vi.resetModules();
    vi.spyOn(AuthClientStore.getInstance(), 'createAuthClient').mockResolvedValue(authClientMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('does nothing and resets the AuthClient when not authenticated', async () => {
    authClientMock.isAuthenticated.mockResolvedValue(false);
    const resetSpy = vi.spyOn(AuthClientStore.getInstance(), 'safeCreateAuthClient');

    const fn = vi.fn();

    await authenticateWithAuthClient({fn});

    expect(authClientMock.isAuthenticated).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalledTimes(1);
    expect(fn).not.toHaveBeenCalled();
  });

  it('executes fn when authenticated', async () => {
    authClientMock.isAuthenticated.mockResolvedValue(true);
    const resetSpy = vi.spyOn(AuthClientStore.getInstance(), 'safeCreateAuthClient');
    const fn = vi.fn().mockResolvedValue(undefined);

    await authenticateWithAuthClient({fn});

    expect(authClientMock.isAuthenticated).toHaveBeenCalled();
    expect(resetSpy).not.toHaveBeenCalled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('always creates a fresh AuthClient', async () => {
    const createSpy = vi.spyOn(AuthClientStore.getInstance(), 'createAuthClient');
    authClientMock.isAuthenticated.mockResolvedValue(true);

    const fn = vi.fn().mockResolvedValue(undefined);

    await authenticateWithAuthClient({fn});
    await authenticateWithAuthClient({fn});

    expect(createSpy).toHaveBeenCalledTimes(2);
  });
});
