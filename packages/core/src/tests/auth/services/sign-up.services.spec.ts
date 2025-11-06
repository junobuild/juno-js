/**
 * @vitest-environment jsdom
 */

import {AuthClient} from '@icp-sdk/auth/client';
import * as identityLib from '@icp-sdk/core/identity';
import * as webAuthnLib from '@junobuild/ic-client/webauthn';
import type {Mock, MockInstance} from 'vitest';
import {mock} from 'vitest-mock-extended';
import * as userServices from '../../../auth/services/_user.services';
import {resetAuth} from '../../../auth/services/sign-out.services';
import {signUp} from '../../../auth/services/sign-up.services';
import * as userWebAuthnServices from '../../../auth/services/user-webauthn.services';
import {AuthStore} from '../../../auth/stores/auth.store';
import {SignInInitError, SignUpProviderNotSupportedError} from '../../../auth/types/errors';
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

describe('sign-up.services', () => {
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
