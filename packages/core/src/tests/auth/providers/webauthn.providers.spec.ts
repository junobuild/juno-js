/**
 * @vitest-environment jsdom
 */

import {IdbStorage, KEY_STORAGE_DELEGATION, KEY_STORAGE_KEY} from '@dfinity/auth-client';
import * as identityLib from '@dfinity/identity';
import {arrayOfNumberToUint8Array} from '@dfinity/utils';
import * as webAuthnLib from '@junobuild/ic-client/webauthn';
import {toArray} from '@junobuild/utils';
import {beforeEach} from 'vitest';
import {WebAuthnProvider} from '../../../auth/providers/webauthn.providers';
import {SignInInitError, WebAuthnSignInRetrievePublicKeyError} from '../../../auth/types/errors';
import {WebAuthnSignInProgressStep} from '../../../auth/types/webauthn';
import * as actorApi from '../../../core/api/actor.api';
import {EnvStore} from '../../../core/stores/env.store';
import {mockSatelliteId, mockUserIdPrincipal} from '../../mocks/core.mock';

describe('webauthn.providers', async () => {
  const publicKey = arrayOfNumberToUint8Array([1, 2, 3, 4, 5]);
  const mockDocApiObject = {
    owner: mockUserIdPrincipal,
    data: await toArray({publicKey}),
    created_at: 0n
  };

  beforeEach(() => {
    EnvStore.getInstance().reset();
    vi.restoreAllMocks();
  });

  describe('signIn', () => {
    it('throws SignInInitError when satelliteId is missing', async () => {
      const provider = new WebAuthnProvider();
      await expect(provider.signIn({loadAuth: async () => {}})).rejects.toThrowError(
        new SignInInitError('Satellite ID not set. Have you initialized the Satellite?')
      );
    });

    describe('With env configured', () => {
      beforeEach(() => {
        EnvStore.getInstance().set({satelliteId: mockSatelliteId});
      });

      it('retrievePublicKey: throws WebAuthnSignInRetrievePublicKeyError when get_doc returns undefined', async () => {
        const get_doc = vi.fn().mockResolvedValue(undefined);
        vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({get_doc} as any);

        vi.spyOn(webAuthnLib.WebAuthnIdentity, 'createWithExistingCredential').mockImplementation(
          async ({retrievePublicKey}: any) => {
            await retrievePublicKey({credentialId: new Uint8Array([1, 2, 3])});
            return {} as any;
          }
        );

        await expect(new WebAuthnProvider().signIn({loadAuth: async () => {}})).rejects.toThrow(
          WebAuthnSignInRetrievePublicKeyError
        );
      });

      describe('With doc', () => {
        beforeEach(() => {
          const get_doc = vi.fn().mockResolvedValue([mockDocApiObject]);
          vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({get_doc} as any);
          vi.spyOn(identityLib, 'unwrapDER').mockReturnValue(arrayOfNumberToUint8Array([1, 2, 3]));
        });

        it('maps lower-level progress steps to provider-level steps', async () => {
          vi.spyOn(webAuthnLib.WebAuthnIdentity, 'createWithExistingCredential').mockImplementation(
            async ({onProgress}) => {
              onProgress?.({
                step: webAuthnLib.WebAuthnSignProgressStep.RequestingUserCredential,
                state: 'in_progress'
              });
              onProgress?.({
                step: webAuthnLib.WebAuthnSignProgressStep.FinalizingCredential,
                state: 'success'
              });
              onProgress?.({
                step: webAuthnLib.WebAuthnSignProgressStep.Signing,
                state: 'in_progress'
              });
              return {} as any;
            }
          );

          vi.spyOn(identityLib.ECDSAKeyIdentity, 'generate').mockResolvedValue({
            getPublicKey: vi.fn(),
            getKeyPair: vi.fn()
          } as any);
          vi.spyOn(identityLib.DelegationChain, 'create').mockResolvedValue({} as any);
          vi.spyOn(identityLib.DelegationIdentity, 'fromDelegation').mockReturnValue({
            getDelegation: () => ({toJSON: () => ({})})
          } as any);

          const events: Array<{step: WebAuthnSignInProgressStep; state: string}> = [];
          await new WebAuthnProvider().signIn({
            options: {onProgress: (e) => events.push(e)},
            loadAuth: async () => {}
          });

          expect(events).toEqual(
            expect.arrayContaining([
              {step: WebAuthnSignInProgressStep.RequestingUserCredential, state: 'in_progress'},
              {step: WebAuthnSignInProgressStep.FinalizingCredential, state: 'success'},
              {step: WebAuthnSignInProgressStep.Signing, state: 'in_progress'},
              {step: WebAuthnSignInProgressStep.FinalizingSession, state: 'in_progress'},
              {step: WebAuthnSignInProgressStep.FinalizingSession, state: 'success'},
              {step: WebAuthnSignInProgressStep.RetrievingUser, state: 'in_progress'},
              {step: WebAuthnSignInProgressStep.RetrievingUser, state: 'success'}
            ])
          );
        });

        it('creates session delegation with provided maxTimeToLiveInMilliseconds', async () => {
          vi.spyOn(webAuthnLib.WebAuthnIdentity, 'createWithExistingCredential').mockResolvedValue(
            {} as any
          );

          const sessionKey = {getPublicKey: vi.fn(), getKeyPair: vi.fn()} as any;
          vi.spyOn(identityLib.ECDSAKeyIdentity, 'generate').mockResolvedValue(sessionKey);

          const chainSpy = vi
            .spyOn(identityLib.DelegationChain, 'create')
            .mockImplementation(async (_identity, _pub, expires) => {
              const delta = Math.abs((expires?.getTime() ?? 0) - (Date.now() + 10_000));
              expect(delta).toBeLessThan(200);
              return {} as any;
            });

          vi.spyOn(identityLib.DelegationIdentity, 'fromDelegation').mockReturnValue({
            getDelegation: () => ({toJSON: () => ({})})
          } as any);

          await new WebAuthnProvider().signIn({
            options: {maxTimeToLiveInMilliseconds: 10_000},
            loadAuth: async () => {}
          });

          expect(chainSpy).toHaveBeenCalledTimes(1);
        });

        it('persists session keys and delegation to IndexedDB', async () => {
          vi.spyOn(webAuthnLib.WebAuthnIdentity, 'createWithExistingCredential').mockResolvedValue(
            {} as any
          );
          vi.spyOn(identityLib.ECDSAKeyIdentity, 'generate').mockResolvedValue({
            getPublicKey: vi.fn(),
            getKeyPair: vi.fn()
          } as any);
          vi.spyOn(identityLib.DelegationChain, 'create').mockResolvedValue({} as any);

          const fakeDelegation = {foo: 'bar'};

          vi.spyOn(identityLib.DelegationIdentity, 'fromDelegation').mockReturnValue({
            getDelegation: () => ({toJSON: () => fakeDelegation})
          } as any);

          await new WebAuthnProvider().signIn({loadAuth: async () => {}});

          const storage = new IdbStorage();
          const storedKey = await storage.get(KEY_STORAGE_KEY);
          const storedDelegation = await storage.get(KEY_STORAGE_DELEGATION);

          expect(storedKey).toBeDefined();
          expect(JSON.parse(storedDelegation ?? '')).toEqual(fakeDelegation);
        });

        it('invokes loadAuth after session is finalized', async () => {
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

          const loadAuth = vi.fn().mockResolvedValue(undefined);

          await new WebAuthnProvider().signIn({loadAuth});

          expect(loadAuth).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
