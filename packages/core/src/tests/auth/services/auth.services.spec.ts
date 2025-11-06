/**
 * @vitest-environment jsdom
 */

import {AuthClient} from '@icp-sdk/auth/client';
import * as identityLib from '@icp-sdk/core/identity';
import * as authLib from '@junobuild/auth';
import * as webAuthnLib from '@junobuild/ic-client/webauthn';
import type {Mock, MockInstance} from 'vitest';
import {mock} from 'vitest-mock-extended';
import * as userServices from '../../../auth/services/_user.services';
import {createAuth, signIn, signUp} from '../../../auth/services/auth.services';
import {loadAuth} from '../../../auth/services/load.services';
import {resetAuth} from '../../../auth/services/sign-out.services';
import * as userWebAuthnServices from '../../../auth/services/user-webauthn.services';
import {AuthStore} from '../../../auth/stores/auth.store';
import type {SignInOptions} from '../../../auth/types/auth';
import {
  SignInError,
  SignInInitError,
  SignInProviderNotSupportedError,
  SignInUserInterruptError,
  SignUpProviderNotSupportedError
} from '../../../auth/types/errors';
import type {GoogleSignInOptions} from '../../../auth/types/google';
import * as actorApi from '../../../core/api/actor.api';
import {EnvStore} from '../../../core/stores/env.store';
import {mockSatelliteId, mockUser, mockUserIdText} from '../../mocks/core.mock';
import {
  mockPasskeyIdentity,
  mockWebAuthnDocApiObject,
  mockWebAuthnDocUserApiObject
} from '../../mocks/webauthn.mock';

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

describe('auth.services', () => {
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

        const options: GoogleSignInOptions = {
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

  describe('signUp', () => {
    beforeEach(async () => {
      authClientMock.isAuthenticated.mockResolvedValue(true);
    });

    it('throws SignUpProviderNotSupportedError when provider is unknown', async () => {
      await expect(signUp({internet_identity: {}} as any)).rejects.toThrowError(
        new SignUpProviderNotSupportedError(
          'An unknown or unsupported provider was provided for sign-up.'
        )
      );
    });

    it('throws SignInInitError when satelliteId is missing', async () => {
      await expect(signUp({webauthn: {}})).rejects.toThrow(SignInInitError);
    });

    describe('with env configured', () => {
      let set_many_docs: MockInstance;

      beforeEach(() => {
        EnvStore.getInstance().set({satelliteId: mockSatelliteId});

        vi.spyOn(webAuthnLib.WebAuthnIdentity, 'createWithNewCredential').mockResolvedValue(
          mockPasskeyIdentity
        );
        vi.spyOn(identityLib.ECDSAKeyIdentity, 'generate').mockResolvedValue({
          getPublicKey: vi.fn(),
          getKeyPair: vi.fn()
        } as any);
        vi.spyOn(identityLib.DelegationChain, 'create').mockResolvedValue({} as any);
        vi.spyOn(identityLib.DelegationIdentity, 'fromDelegation').mockReturnValue({
          getDelegation: () => ({toJSON: () => ({})}),
          getPrincipal: () => ({toText: () => mockUserIdText})
        } as any);

        set_many_docs = vi.fn().mockResolvedValue([
          [mockUserIdText, mockWebAuthnDocUserApiObject],
          [mockPasskeyIdentity.getCredential().getCredentialIdText(), mockWebAuthnDocApiObject]
        ]);
        vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({set_many_docs} as any);
      });

      it('use window guard (adds/removes by default)', async () => {
        const addSpy = vi.spyOn(window, 'addEventListener').mockImplementation(() => undefined);
        const removeSpy = vi
          .spyOn(window, 'removeEventListener')
          .mockImplementation(() => undefined);

        await signUp({webauthn: {}});

        expect(addSpy).toHaveBeenCalledTimes(1);
        expect(removeSpy).toHaveBeenCalledTimes(1);
      });

      it('does not add/remove window guard when opted out', async () => {
        const addSpy = vi.spyOn(window, 'addEventListener').mockImplementation(() => undefined);
        const removeSpy = vi
          .spyOn(window, 'removeEventListener')
          .mockImplementation(() => undefined);

        await signUp({webauthn: {context: {windowGuard: false}}});

        expect(addSpy).not.toHaveBeenCalled();
        expect(removeSpy).not.toHaveBeenCalled();
      });

      it('should use maxTimeToLiveInMilliseconds', async () => {
        const chainSpy = vi
          .spyOn(identityLib.DelegationChain, 'create')
          .mockImplementation(async (_identity, _pub, expires) => {
            const delta = Math.abs((expires?.getTime() ?? 0) - (Date.now() + 12_345));
            expect(delta).toBeLessThan(200);
            return {} as any;
          });

        await signUp({webauthn: {options: {maxTimeToLiveInMilliseconds: 12_345}}});

        expect(chainSpy).toHaveBeenCalledTimes(1);
      });

      it('should forward passkey options to WebAuthnProvider.signUp', async () => {
        const passkeyOptions = {
          user: {displayName: 'Maria Sanchez', name: 'maria@example.com'},
          appId: {id: 'example.com'}
        };

        const spy = vi
          .spyOn(webAuthnLib.WebAuthnIdentity, 'createWithNewCredential')
          .mockResolvedValue(mockPasskeyIdentity);

        await signUp({
          webauthn: {
            options: {passkey: passkeyOptions}
          }
        });

        const arg = spy.mock.calls[0][0];
        expect(arg?.passkeyOptions).toEqual(passkeyOptions);
      });

      it('it should call webauthn provider on signUp', async () => {
        const loginSpy = authClientMock.login.mockImplementation(async () => {
          throw new Error('authClient.login must not be called for webauthn signUp');
        });

        const loadSpy = vi.spyOn(userServices, 'loadUser');
        const createSpy = vi.spyOn(userWebAuthnServices, 'createWebAuthnUser');

        await expect(signUp({webauthn: {}})).resolves.toBeUndefined();

        expect(loginSpy).not.toHaveBeenCalled();
        expect(set_many_docs).toHaveBeenCalledTimes(1);

        expect(loadSpy).not.toHaveBeenCalled();
        expect(createSpy).toHaveBeenCalledTimes(1);

        expect(AuthStore.getInstance().get()).toEqual(
          expect.objectContaining({key: mockUserIdText})
        );
      });
    });
  });
});
