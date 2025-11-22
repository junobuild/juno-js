import type {AuthClient} from '@icp-sdk/auth/client';
import {mock} from 'vitest-mock-extended';
import {authenticateWithAuthClient} from '../../../auth/services/_auth-client.services';
import {AuthClientStore} from '../../../auth/stores/auth-client.store';
import {AuthBroadcastChannel} from '../../../auth/providers/_auth-broadcast.providers';

describe('_auth-client.services', () => {
  const authClientMock = mock<AuthClient>();

  beforeEach(() => {
    vi.resetModules();

    vi.spyOn(AuthClientStore.getInstance(), 'createAuthClient').mockResolvedValue(authClientMock);

    vi.spyOn(AuthBroadcastChannel, 'getInstance').mockReturnValue({
      postLoginSuccess: vi.fn()
    } as unknown as AuthBroadcastChannel);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('does nothing and resets the AuthClient when not authenticated', async () => {
    authClientMock.isAuthenticated.mockResolvedValue(false);
    const resetSpy = vi.spyOn(AuthClientStore.getInstance(), 'safeCreateAuthClient');

    const fn = vi.fn();

    await authenticateWithAuthClient({fn, syncTabsOnSuccess: false});

    expect(authClientMock.isAuthenticated).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalledTimes(1);
    expect(fn).not.toHaveBeenCalled();
  });

  it('executes fn when authenticated', async () => {
    authClientMock.isAuthenticated.mockResolvedValue(true);
    const resetSpy = vi.spyOn(AuthClientStore.getInstance(), 'safeCreateAuthClient');
    const fn = vi.fn().mockResolvedValue(undefined);

    await authenticateWithAuthClient({fn, syncTabsOnSuccess: false});

    expect(authClientMock.isAuthenticated).toHaveBeenCalled();
    expect(resetSpy).not.toHaveBeenCalled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('always creates a fresh AuthClient', async () => {
    const createSpy = vi.spyOn(AuthClientStore.getInstance(), 'createAuthClient');
    authClientMock.isAuthenticated.mockResolvedValue(true);

    const fn = vi.fn().mockResolvedValue(undefined);

    await authenticateWithAuthClient({fn, syncTabsOnSuccess: false});
    await authenticateWithAuthClient({fn, syncTabsOnSuccess: false});

    expect(createSpy).toHaveBeenCalledTimes(2);
  });

  it('does not broadcast when syncTabsOnSuccess=false', async () => {
    authClientMock.isAuthenticated.mockResolvedValue(true);

    const broadcaster = AuthBroadcastChannel.getInstance();
    const postSpy = vi.spyOn(broadcaster, 'postLoginSuccess');

    await authenticateWithAuthClient({fn: vi.fn(), syncTabsOnSuccess: false});

    expect(postSpy).not.toHaveBeenCalled();
  });

  it('broadcasts when syncTabsOnSuccess=true', async () => {
    authClientMock.isAuthenticated.mockResolvedValue(true);

    const broadcaster = AuthBroadcastChannel.getInstance();
    const postSpy = vi.spyOn(broadcaster, 'postLoginSuccess');

    await authenticateWithAuthClient({fn: vi.fn(), syncTabsOnSuccess: true});

    expect(postSpy).toHaveBeenCalledTimes(1);
  });

  it('does not broadcast when not authenticated even if syncTabsOnSuccess=true', async () => {
    authClientMock.isAuthenticated.mockResolvedValue(false);

    const resetSpy = vi.spyOn(AuthClientStore.getInstance(), 'safeCreateAuthClient');
    const broadcaster = AuthBroadcastChannel.getInstance();
    const postSpy = vi.spyOn(broadcaster, 'postLoginSuccess');

    const fn = vi.fn();

    await authenticateWithAuthClient({fn, syncTabsOnSuccess: true});

    expect(authClientMock.isAuthenticated).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalledTimes(1);
    expect(fn).not.toHaveBeenCalled();
    expect(postSpy).not.toHaveBeenCalled();
  });
});
