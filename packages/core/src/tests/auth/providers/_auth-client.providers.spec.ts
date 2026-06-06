/**
 * @vitest-environment jsdom
 */
import type {AuthClient} from '@icp-sdk/auth/client';
import {mock} from 'vitest-mock-extended';
import {AuthClientProvider} from '../../../auth/providers/_auth-client.providers';
import {AuthClientSignInProgressStep} from '../../../auth/types/auth-client';
import {SignInError} from '../../../auth/types/errors';
import {ProviderWithoutData} from '../../../auth/types/provider';

vi.mock('@icp-sdk/auth/client', async () => {
  const actual = (await import('@icp-sdk/auth/client')) as typeof import('@icp-sdk/auth/client');
  return {
    ...actual,
    // v7: `AuthClient` is a constructor, not a `create()` factory.
    AuthClient: vi.fn()
  };
});

class TestProvider extends AuthClientProvider {
  get id(): ProviderWithoutData {
    return 'internet_identity';
  }

  signInOptions({windowed}: {windowed?: boolean}) {
    return {
      identityProvider: 'https://identity.ic0.app',
      windowOpenerFeatures: windowed ? 'width=500, height=600' : undefined
    };
  }
}

describe('_auth-client.provider', () => {
  const authClientMock = mock<AuthClient>();
  const createAuthClient = vi.fn();
  let provider: TestProvider;

  beforeEach(() => {
    vi.clearAllMocks();

    provider = new TestProvider();
    authClientMock.signIn.mockReset();
    createAuthClient.mockReset();
    createAuthClient.mockResolvedValue(authClientMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('emits progress for both steps and resolves on success', async () => {
    const onProgress = vi.fn();
    const initAuth = vi.fn().mockResolvedValue(undefined);

    authClientMock.signIn.mockResolvedValue(mock());

    await expect(
      provider.signIn({
        options: {onProgress},
        createAuthClient,
        initAuth
      })
    ).resolves.toBeUndefined();

    expect(authClientMock.signIn).toHaveBeenCalledTimes(1);
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

  it('maps a thrown sign-in error to SignInError and emits error for first step', async () => {
    const onProgress = vi.fn();
    const initAuth = vi.fn().mockResolvedValue(undefined);

    authClientMock.signIn.mockRejectedValue(new Error('Boom'));

    await expect(
      provider.signIn({
        options: {onProgress},
        createAuthClient,
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

  it('builds the AuthClient with provider options and signs in with maxTimeToLive', async () => {
    const onProgress = vi.fn();
    const initAuth = vi.fn().mockResolvedValue(undefined);

    authClientMock.signIn.mockResolvedValue(mock());

    await expect(
      provider.signIn({
        options: {
          onProgress,
          windowed: true,
          maxTimeToLiveInNanoseconds: 123n,
          derivationOrigin: 'https://example.com'
        },
        createAuthClient,
        initAuth
      })
    ).resolves.toBeUndefined();

    // v7: provider options are passed at construction, not to signIn().
    expect(createAuthClient).toHaveBeenCalledWith({
      identityProvider: 'https://identity.ic0.app',
      windowOpenerFeatures: 'width=500, height=600',
      derivationOrigin: 'https://example.com'
    });
    expect(authClientMock.signIn).toHaveBeenCalledWith({maxTimeToLive: 123n});
    expect(initAuth).toHaveBeenCalledTimes(1);
  });
});
