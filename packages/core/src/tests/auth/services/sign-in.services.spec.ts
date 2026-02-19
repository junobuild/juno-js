/**
 * @vitest-environment jsdom
 */

import {AuthClient} from '@icp-sdk/auth/client';
import * as identityLib from '@icp-sdk/core/identity';
import * as authLib from '@junobuild/auth/delegation';
import * as devLib from '@junobuild/ic-client/dev';
import * as webAuthnLib from '@junobuild/ic-client/webauthn';
import type {Mock} from 'vitest';
import {mock} from 'vitest-mock-extended';
import * as authClientServices from '../../../auth/services/_auth-client.services';
import * as userServices from '../../../auth/services/_user.services';
import {loadAuth} from '../../../auth/services/load.services';
import {createAuth, signIn} from '../../../auth/services/sign-in.services';
import {resetAuth} from '../../../auth/services/sign-out.services';
import {AuthStore} from '../../../auth/stores/auth.store';
import type {SignInOptions} from '../../../auth/types/auth';
import {DevIdentitySignInOptions} from '../../../auth/types/dev-identity';
import {
  SignInError,
  SignInInitError,
  SignInProviderNotSupportedError,
  SignInUserInterruptError
} from '../../../auth/types/errors';
import type {GitHubSignInRedirectOptions} from '../../../auth/types/github';
import type {GoogleSignInRedirectOptions} from '../../../auth/types/google';
import {EnvStore} from '../../../core/stores/env.store';
import {mockSatelliteId, mockUser, mockUserIdText} from '../../mocks/core.mock';

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

describe('sign-in.services', () => {
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

  describe('createAuth', () => {
    it('does nothing if not authenticated', async () => {
      authClientMock.isAuthenticated.mockResolvedValue(false);

      await createAuth({provider: 'internet_identity'});

      expect(authClientMock.isAuthenticated).toHaveBeenCalled();
    });

    it('initializes user if authenticated', async () => {
      authClientMock.isAuthenticated.mockResolvedValue(true);

      const authStore = AuthStore.getInstance();
      authStore.reset();

      await createAuth({provider: 'internet_identity'});

      expect(authClientMock.isAuthenticated).toHaveBeenCalled();
      expect(authStore.get()).not.toBeNull();
    });

    it('calls authenticateWithAuthClient with syncTabsOnSuccess=true on createAuth', async () => {
      const spy = vi.spyOn(authClientServices, 'authenticateWithAuthClient');

      await createAuth({provider: 'internet_identity'});

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          syncTabsOnSuccess: true
        })
      );
    });
  });

  describe('signIn', () => {
    const mockSignInOptions: SignInOptions = {internet_identity: {}};

    it('throws SignInInitError if authClient is null', async () => {
      await expect(signIn(mockSignInOptions)).rejects.toThrowError(
        new SignInInitError(
          'No client is ready to perform a sign-in. Have you initialized the Satellite?'
        )
      );
    });

    describe('Initialized', () => {
      beforeEach(async () => {
        await loadAuth();
      });

      it('resolves if login succeeds', async () => {
        authClientMock.isAuthenticated.mockResolvedValue(false);
        authClientMock.login.mockImplementation(async (options) => {
          // @ts-ignore
          options?.onSuccess?.();
        });

        await expect(signIn(mockSignInOptions)).resolves.toBeUndefined();
      });

      it('throws SignInProviderNotSupportedError when provider is unknown', async () => {
        await expect(signIn({unknown: {}} as any)).rejects.toThrowError(
          new SignInProviderNotSupportedError(
            'An unknown or unsupported provider was provided for sign-in.'
          )
        );
      });

      it('add and remove window beforeunload guard', async () => {
        const addSpy = vi.spyOn(window, 'addEventListener').mockImplementation(() => undefined);
        const removeSpy = vi
          .spyOn(window, 'removeEventListener')
          .mockImplementation(() => undefined);

        authClientMock.isAuthenticated.mockResolvedValue(false);
        authClientMock.login.mockImplementation(async (options) => {
          // @ts-ignore
          options?.onSuccess?.();
        });

        await signIn(mockSignInOptions);

        expect(addSpy).toHaveBeenCalledTimes(1);
        expect(removeSpy).toHaveBeenCalledTimes(1);
      });

      it('should not add and remove window beforeunload guard if opted-out', async () => {
        const addSpy = vi.spyOn(window, 'addEventListener').mockImplementation(() => undefined);
        const removeSpy = vi
          .spyOn(window, 'removeEventListener')
          .mockImplementation(() => undefined);

        authClientMock.isAuthenticated.mockResolvedValue(false);
        authClientMock.login.mockImplementation(async (options) => {
          // @ts-ignore
          options?.onSuccess?.();
        });

        await signIn({internet_identity: {context: {windowGuard: false}}});

        expect(addSpy).not.toHaveBeenCalled();
        expect(removeSpy).not.toHaveBeenCalled();
      });

      it('should not add and remove window beforeunload guard for Google redirect', async () => {
        const addSpy = vi.spyOn(window, 'addEventListener').mockImplementation(() => undefined);
        const removeSpy = vi
          .spyOn(window, 'removeEventListener')
          .mockImplementation(() => undefined);

        authClientMock.isAuthenticated.mockResolvedValue(false);
        authClientMock.login.mockImplementation(async (options) => {
          // @ts-ignore
          options?.onSuccess?.();
        });

        vi.spyOn(authLib, 'requestJwt').mockResolvedValue(undefined);

        await signIn({
          google: {
            options: {redirect: {clientId: '123'}}
          }
        });

        expect(addSpy).not.toHaveBeenCalled();
        expect(removeSpy).not.toHaveBeenCalled();
      });

      it('should not add and remove window beforeunload guard for GitHub redirect', async () => {
        const addSpy = vi.spyOn(window, 'addEventListener').mockImplementation(() => undefined);
        const removeSpy = vi
          .spyOn(window, 'removeEventListener')
          .mockImplementation(() => undefined);

        authClientMock.isAuthenticated.mockResolvedValue(false);
        authClientMock.login.mockImplementation(async (options) => {
          // @ts-ignore
          options?.onSuccess?.();
        });

        vi.spyOn(authLib, 'requestJwt').mockResolvedValue(undefined);

        await signIn({
          github: {
            options: {redirect: {clientId: '456'}}
          }
        });

        expect(addSpy).not.toHaveBeenCalled();
        expect(removeSpy).not.toHaveBeenCalled();
      });

      it('call auth client with internet identity options', async () => {
        authClientMock.isAuthenticated.mockResolvedValue(false);
        const spy = authClientMock.login.mockImplementation(async (options) => {
          // @ts-ignore
          options?.onSuccess?.();
        });

        await expect(
          signIn({
            internet_identity: {
              options: {
                maxTimeToLiveInNanoseconds: 111n,
                domain: 'ic0.app'
              }
            }
          })
        ).resolves.toBeUndefined();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            allowPinAuthentication: false,
            identityProvider: 'https://identity.ic0.app',
            maxTimeToLive: 111n,
            windowOpenerFeatures:
              'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=576, height=576, top=96, left=224'
          })
        );
      });

      it('should call webauthn provider with options', async () => {
        EnvStore.getInstance().set({satelliteId: mockSatelliteId});

        const loginSpy = authClientMock.login.mockImplementation(async () => {
          throw new Error('authClient.login must not be called for webauthn');
        });

        vi.spyOn(webAuthnLib.WebAuthnIdentity, 'createWithExistingCredential').mockResolvedValue(
          {} as any
        );
        vi.spyOn(identityLib.ECDSAKeyIdentity, 'generate').mockResolvedValue({
          getPublicKey: vi.fn(),
          getKeyPair: vi.fn()
        } as any);
        vi.spyOn(identityLib.DelegationChain, 'create').mockResolvedValue({} as any);
        vi.spyOn(identityLib.DelegationIdentity, 'fromDelegation').mockReturnValue({
          getDelegation: () => ({toJSON: () => ({})})
        } as any);

        authClientMock.isAuthenticated.mockResolvedValue(true);

        await expect(signIn({webauthn: {}})).resolves.toBeUndefined();

        expect(loginSpy).not.toHaveBeenCalled();
        expect(userServices.loadUser).toHaveBeenCalled();
      });

      it('should call google provider with options', async () => {
        await loadAuth();

        const requestSpy = vi.spyOn(authLib, 'requestJwt').mockResolvedValue(undefined);

        const options: GoogleSignInRedirectOptions = {
          redirect: {
            clientId: 'client-abc',
            authScopes: ['openid', 'profile'],
            redirectUrl: 'https://app.example.com/auth/callback',
            loginHint: 'dev@example.com'
          }
        };

        await expect(
          signIn({
            google: {
              options
            }
          })
        ).resolves.toBeUndefined();

        expect(requestSpy).toHaveBeenCalledExactlyOnceWith({
          google: {
            redirect: options.redirect
          }
        });
      });

      it('should call github provider with options', async () => {
        await loadAuth();

        const requestSpy = vi.spyOn(authLib, 'requestJwt').mockResolvedValue(undefined);

        const options: GitHubSignInRedirectOptions = {
          redirect: {
            clientId: 'client-xyz',
            authScopes: ['read:user', 'user:email'],
            redirectUrl: 'https://app.example.com/auth/callback',
            initUrl: 'https://custom.api.com/oauth/init'
          }
        };

        await expect(
          signIn({
            github: {
              options
            }
          })
        ).resolves.toBeUndefined();

        expect(requestSpy).toHaveBeenCalledExactlyOnceWith({
          github: {
            redirect: options.redirect
          }
        });
      });

      it('should call dev provider with options', async () => {
        await loadAuth();

        const generateSpy = vi.spyOn(devLib, 'generateUnsafeDevIdentity').mockResolvedValue({
          identity: {} as any,
          sessionKey: {getKeyPair: vi.fn()} as any,
          delegationChain: {toJSON: vi.fn().mockReturnValue({})} as any
        });

        authClientMock.isAuthenticated.mockResolvedValue(true);

        const options: DevIdentitySignInOptions = {
          identifier: 'alice',
          maxTimeToLiveInMilliseconds: 24 * 60 * 60 * 1000
        };

        await expect(
          signIn({
            dev: {
              options
            }
          })
        ).resolves.toBeUndefined();

        expect(generateSpy).toHaveBeenCalledWith(options);
        expect(userServices.loadUser).toHaveBeenCalled();
      });

      it('rejects with SignInUserInterruptError if interrupted', async () => {
        authClientMock.isAuthenticated.mockResolvedValue(false);
        authClientMock.login.mockImplementation(async (options) => {
          options?.onError?.('UserInterrupt');
        });

        await expect(signIn(mockSignInOptions)).rejects.toSatisfy((error) => {
          return error instanceof SignInUserInterruptError && error.message === 'UserInterrupt';
        });
      });

      it('rejects with SignInError on generic error', async () => {
        authClientMock.isAuthenticated.mockResolvedValue(false);
        authClientMock.login.mockImplementation(async (options) => {
          options?.onError?.('AnotherError');
        });

        await expect(signIn(mockSignInOptions)).rejects.toSatisfy((error) => {
          return error instanceof SignInError && error.message === 'AnotherError';
        });
      });
    });
  });
});
