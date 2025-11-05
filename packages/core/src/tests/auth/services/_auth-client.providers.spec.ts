/**
 * @vitest-environment jsdom
 */
import type {AuthClient} from '@icp-sdk/auth/client';
import {ERROR_USER_INTERRUPT} from '@icp-sdk/auth/client';
import {mock} from 'vitest-mock-extended';
import {AuthClientProvider} from '../../../auth/providers/_auth-client.providers';
import {AuthClientSignInProgressStep} from '../../../auth/types/auth-client';
import {SignInError, SignInInitError, SignInUserInterruptError} from '../../../auth/types/errors';
import {Provider} from '../../../auth/types/provider';

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

class TestProvider extends AuthClientProvider {
  get id(): Provider {
    return 'internet_identity';
  }

  signInOptions({windowed}: {windowed?: boolean}) {
    return {
      identityProvider: 'https://identity.ic0.app',
      windowOpenerFeatures: windowed
        ? 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=500, height=600'
        : undefined
    };
  }
}

describe('_auth-client.provider', () => {
  const authClientMock = mock<AuthClient>();
  let provider: TestProvider;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    provider = new TestProvider();
    authClientMock.login.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('emits progress for both steps and resolves on success', async () => {
    const onProgress = vi.fn();
    const initAuth = vi.fn().mockResolvedValue(undefined);

    authClientMock.login.mockImplementation(async (options: any) => {
      options?.onSuccess?.();
    });

    await expect(
      provider.signIn({
        options: {onProgress},
        authClient: authClientMock,
        initAuth
      })
    ).resolves.toBeUndefined();

    expect(authClientMock.login).toHaveBeenCalledTimes(1);
    expect(initAuth).toHaveBeenCalledTimes(1);
    expect(initAuth).toHaveBeenCalledWith({provider: provider.id});

    expect(onProgress).toHaveBeenNthCalledWith(1, {
      step: AuthClientSignInProgressStep.AuthorizingWithProvider,
      state: 'in_progress'
    });
    expect(onProgress).toHaveBeenNthCalledWith(2, {
      step: AuthClientSignInProgressStep.AuthorizingWithProvider,
      state: 'success'
    });
    expect(onProgress).toHaveBeenNthCalledWith(3, {
      step: AuthClientSignInProgressStep.CreatingOrRetrievingUser,
      state: 'in_progress'
    });
    expect(onProgress).toHaveBeenNthCalledWith(4, {
      step: AuthClientSignInProgressStep.CreatingOrRetrievingUser,
      state: 'success'
    });
  });

  it('rejects with SignInInitError when authClient is null and emits progress error for first step', async () => {
    const onProgress = vi.fn();
    const initAuth = vi.fn().mockResolvedValue(undefined);

    await expect(
      provider.signIn({
        options: {onProgress},
        authClient: null,
        initAuth
      })
    ).rejects.toBeInstanceOf(SignInInitError);

    expect(onProgress).toHaveBeenNthCalledWith(1, {
      step: AuthClientSignInProgressStep.AuthorizingWithProvider,
      state: 'in_progress'
    });
    expect(onProgress).toHaveBeenNthCalledWith(2, {
      step: AuthClientSignInProgressStep.AuthorizingWithProvider,
      state: 'error'
    });

    expect(initAuth).not.toHaveBeenCalled();
  });

  it('maps ERROR_USER_INTERRUPT to SignInUserInterruptError and emits error for first step', async () => {
    const onProgress = vi.fn();
    const initAuth = vi.fn().mockResolvedValue(undefined);

    authClientMock.login.mockImplementation(async (options: any) => {
      options?.onError?.(ERROR_USER_INTERRUPT);
    });

    await expect(
      provider.signIn({
        options: {onProgress},
        authClient: authClientMock,
        initAuth
      })
    ).rejects.toBeInstanceOf(SignInUserInterruptError);

    expect(onProgress).toHaveBeenNthCalledWith(1, {
      step: AuthClientSignInProgressStep.AuthorizingWithProvider,
      state: 'in_progress'
    });
    expect(onProgress).toHaveBeenNthCalledWith(2, {
      step: AuthClientSignInProgressStep.AuthorizingWithProvider,
      state: 'error'
    });

    expect(initAuth).not.toHaveBeenCalled();
  });

  it('maps generic auth-client error to SignInError and emits error for first step', async () => {
    const onProgress = vi.fn();
    const initAuth = vi.fn().mockResolvedValue(undefined);

    authClientMock.login.mockImplementation(async (options: any) => {
      options?.onError?.('Boom');
    });

    await expect(
      provider.signIn({
        options: {onProgress},
        authClient: authClientMock,
        initAuth
      })
    ).rejects.toBeInstanceOf(SignInError);

    expect(onProgress).toHaveBeenNthCalledWith(1, {
      step: AuthClientSignInProgressStep.AuthorizingWithProvider,
      state: 'in_progress'
    });
    expect(onProgress).toHaveBeenNthCalledWith(2, {
      step: AuthClientSignInProgressStep.AuthorizingWithProvider,
      state: 'error'
    });

    expect(initAuth).not.toHaveBeenCalled();
  });

  it('forwards options to auth-client.login and signInOptions()', async () => {
    const onProgress = vi.fn();
    const initAuth = vi.fn().mockResolvedValue(undefined);

    authClientMock.login.mockImplementation(async (options: any) => {
      expect(options).toEqual(
        expect.objectContaining({
          identityProvider: 'https://identity.ic0.app',
          windowOpenerFeatures:
            'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=500, height=600',
          maxTimeToLive: 123n,
          allowPinAuthentication: false,
          derivationOrigin: 'https://example.com'
        })
      );
      options?.onSuccess?.();
    });

    await expect(
      provider.signIn({
        options: {
          onProgress,
          windowed: true,
          maxTimeToLiveInNanoseconds: 123n,
          allowPin: false,
          derivationOrigin: 'https://example.com'
        },
        authClient: authClientMock,
        initAuth
      })
    ).resolves.toBeUndefined();

    expect(authClientMock.login).toHaveBeenCalledTimes(1);
    expect(initAuth).toHaveBeenCalledTimes(1);
  });
});
