/**
 * @vitest-environment jsdom
 */

import * as agent from '@dfinity/agent';
import type {Mock, MockInstance} from 'vitest';
import * as agentClone from '../../webauthn/agent-js/cose-utils';
import {WebAuthnExistingCredential, WebAuthnNewCredential} from '../../webauthn/credential';
import {
  WebAuthnIdentityCreateCredentialOnTheDeviceError,
  WebAuthnIdentityCredentialNotInitializedError,
  WebAuthnIdentityCredentialNotPublicKeyError,
  WebAuthnIdentityInvalidCredentialIdError,
  WebAuthnIdentityNoAttestationError,
  WebAuthnIdentityNoAuthenticatorDataError
} from '../../webauthn/errors';
import {WebAuthnIdentity} from '../../webauthn/identity';
import {RetrievePublicKeyFn} from '../../webauthn/types/identity';
import {WebAuthnSignProgressStep} from '../../webauthn/types/progress';

describe('WebAuthnIdentity', () => {
  let mockedCredentials: CredentialsContainer & {create: Mock; get: Mock};

  const stringToUint8Array = (s: string): Uint8Array => new TextEncoder().encode(s);
  const uint8ArrayToBuffer = (u8: Uint8Array): ArrayBufferLike => u8.buffer;

  beforeEach(() => {
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      href: 'https://app.example.com/welcome'
    });

    mockedCredentials = {create: vi.fn(), get: vi.fn()} as CredentialsContainer & {
      create: Mock;
      get: Mock;
    };

    Object.defineProperty(navigator, 'credentials', {
      configurable: true,
      value: mockedCredentials
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('With new credential', () => {
    describe('Create WebAuthnIdentity', () => {
      describe('Success', () => {
        const rawIdBytes = new Uint8Array([1, 2, 3]);
        const attestationObject = new Uint8Array([8, 7, 6, 4, 3]);

        let spyCredentialsCreate: MockInstance;

        beforeEach(() => {
          vi.spyOn(agent.Cbor, 'decode').mockReturnValue({
            authData: new Uint8Array([9, 9, 9])
          } as unknown);
          vi.spyOn(agentClone, '_authDataToCose').mockReturnValue(new Uint8Array([7, 7, 7]));

          spyCredentialsCreate = vi.spyOn(navigator.credentials, 'create');
          spyCredentialsCreate.mockResolvedValue({
            type: 'public-key',
            rawId: rawIdBytes.buffer,
            response: {attestationObject}
          } as unknown as PublicKeyCredential);
        });

        it('should create a WebAuthnIdentity initialized with new credential', async () => {
          const identity = await WebAuthnIdentity.createWithNewCredential();

          expect(spyCredentialsCreate).toHaveBeenCalledTimes(1);

          expect(navigator.credentials.create).toHaveBeenCalledTimes(1);
          expect(agent.Cbor.decode).toHaveBeenCalledWith(attestationObject);
          expect(agentClone._authDataToCose).toHaveBeenCalled();

          const cred = identity.getCredential();
          expect(cred.getCredentialId()).toEqual(rawIdBytes);
          expect(identity.getPublicKey()).toBeTruthy();
        });

        it('should create a WebAuthnIdentity with a dedicated credential class type', async () => {
          const identity = await WebAuthnIdentity.createWithNewCredential();

          expect(identity.getCredential()).toBeInstanceOf(WebAuthnNewCredential);
        });
      });

      describe('Errors', () => {
        it('throws when device returns null', async () => {
          vi.spyOn(navigator.credentials, 'create').mockResolvedValue(
            null as unknown as Credential
          );
          await expect(WebAuthnIdentity.createWithNewCredential()).rejects.toBeInstanceOf(
            WebAuthnIdentityCreateCredentialOnTheDeviceError
          );
        });

        it('throws when credential type is not public-key', async () => {
          vi.spyOn(navigator.credentials, 'create').mockResolvedValue({
            type: 'password'
          } as Credential);
          await expect(WebAuthnIdentity.createWithNewCredential()).rejects.toBeInstanceOf(
            WebAuthnIdentityCredentialNotPublicKeyError
          );
        });

        it('throws when attestationObject is missing', async () => {
          vi.spyOn(navigator.credentials, 'create').mockResolvedValue({
            type: 'public-key',
            rawId: new ArrayBuffer(8),
            response: {}
          } as unknown as PublicKeyCredential);
          await expect(WebAuthnIdentity.createWithNewCredential()).rejects.toBeInstanceOf(
            WebAuthnIdentityNoAttestationError
          );
        });
      });
    });

    describe('Sign', () => {
      const rawIdBytes = new Uint8Array([1, 2, 3]);

      beforeEach(() => {
        vi.spyOn(agent.Cbor, 'decode').mockReturnValue({
          authData: new Uint8Array([9, 9, 9])
        } as unknown);

        vi.spyOn(agentClone, '_authDataToCose').mockReturnValue(new Uint8Array([7, 7, 7]));

        const attestationObject = new ArrayBuffer(8);

        vi.spyOn(navigator.credentials, 'create').mockResolvedValue({
          type: 'public-key',
          rawId: rawIdBytes.buffer,
          response: {attestationObject}
        } as unknown as PublicKeyCredential);
      });

      it('should sign successfully (matching credential id) and emit progress', async () => {
        vi.spyOn(agent.Cbor, 'encode').mockReturnValue(new Uint8Array([16, 15, 14]));

        vi.spyOn(navigator.credentials, 'get').mockResolvedValue({
          type: 'public-key',
          rawId: rawIdBytes.buffer,
          response: {
            clientDataJSON: uint8ArrayToBuffer(stringToUint8Array('{"type":"webauthn.get"}')),
            authenticatorData: new Uint8Array([4, 4, 4, 5, 5, 5]),
            signature: uint8ArrayToBuffer(new Uint8Array([1]))
          }
        } as unknown as PublicKeyCredential);

        const onProgress = vi.fn();

        const identity = await WebAuthnIdentity.createWithNewCredential({onProgress});

        const signature = await identity.sign(new Uint8Array([4, 4, 4, 5, 5, 5]));
        expect(signature).toBeInstanceOf(Uint8Array);

        const calls = onProgress.mock.calls.map((c) => c[0]);

        expect(calls).toEqual([
          {step: WebAuthnSignProgressStep.RequestingUserCredential, state: 'in_progress'},
          {step: WebAuthnSignProgressStep.RequestingUserCredential, state: 'success'},
          {step: WebAuthnSignProgressStep.FinalizingCredential, state: 'in_progress'},
          {step: WebAuthnSignProgressStep.FinalizingCredential, state: 'success'},
          {step: WebAuthnSignProgressStep.Signing, state: 'in_progress'},
          {step: WebAuthnSignProgressStep.Signing, state: 'success'}
        ]);
      });

      it('should throw when credential id mismatches', async () => {
        vi.spyOn(navigator.credentials, 'get').mockResolvedValue({
          type: 'public-key',
          rawId: uint8ArrayToBuffer(new Uint8Array([9, 9, 9])),
          response: {
            clientDataJSON: uint8ArrayToBuffer(stringToUint8Array('{}')),
            authenticatorData: new ArrayBuffer(2),
            signature: uint8ArrayToBuffer(new Uint8Array([1]))
          }
        } as unknown as PublicKeyCredential);

        const identity = await WebAuthnIdentity.createWithNewCredential();

        await expect(identity.sign(new Uint8Array([1, 2, 3, 444]))).rejects.toBeInstanceOf(
          WebAuthnIdentityInvalidCredentialIdError
        );
      });

      it('should throw when authenticatorData is missing', async () => {
        vi.spyOn(navigator.credentials, 'get').mockResolvedValue({
          type: 'public-key',
          rawId: rawIdBytes.buffer,
          response: {
            clientDataJSON: uint8ArrayToBuffer(stringToUint8Array('{}')),
            signature: uint8ArrayToBuffer(new Uint8Array([1]))
          }
        } as unknown as PublicKeyCredential);

        const identity = await WebAuthnIdentity.createWithNewCredential();

        await expect(identity.sign(new Uint8Array([1, 2, 3, 444]))).rejects.toBeInstanceOf(
          WebAuthnIdentityNoAuthenticatorDataError
        );
      });

      it('should throw when signature is missing', async () => {
        const rawIdBytes = new Uint8Array([1, 2, 3]);
        const attestationObject = new ArrayBuffer(8);

        vi.spyOn(agent.Cbor, 'decode').mockReturnValue({
          authData: new Uint8Array([9, 9, 9])
        } as unknown);
        vi.spyOn(agentClone, '_authDataToCose').mockReturnValue(new Uint8Array([7, 7, 7]));
        vi.spyOn(navigator.credentials, 'create').mockResolvedValue({
          type: 'public-key',
          rawId: rawIdBytes.buffer,
          response: {attestationObject}
        } as unknown as PublicKeyCredential);

        const identity = await WebAuthnIdentity.createWithNewCredential();

        vi.spyOn(navigator.credentials, 'get').mockResolvedValue({
          type: 'public-key',
          rawId: rawIdBytes.buffer,
          response: {
            clientDataJSON: uint8ArrayToBuffer(stringToUint8Array('{}')),
            authenticatorData: new ArrayBuffer(2)
          }
        } as unknown as PublicKeyCredential);

        await expect(identity.sign(new Uint8Array([1, 2, 3, 444]))).rejects.toBeInstanceOf(
          WebAuthnIdentityNoAuthenticatorDataError
        );
      });
    });
  });

  describe('With existing credential', () => {
    describe('Create WebAuthnIdentity', () => {
      it('should creates with existing credential', async () => {
        const retrievePublicKey = vi.fn(async () => new Uint8Array([1, 2, 3]));

        const identity = await WebAuthnIdentity.createWithExistingCredential({
          retrievePublicKey
        });

        expect(() => identity.getPublicKey()).toThrow(
          WebAuthnIdentityCredentialNotInitializedError
        );
        expect(() => identity.getCredential()).toThrow(
          WebAuthnIdentityCredentialNotInitializedError
        );
        expect(retrievePublicKey).not.toHaveBeenCalled();
      });
    });

    describe('Sign', () => {
      describe('With success retrieve public key', () => {
        let retrievePublicKey: RetrievePublicKeyFn;

        beforeEach(() => {
          retrievePublicKey = vi.fn(async () => new Uint8Array([1, 2, 3]));
        });

        describe('With authenticator success', () => {
          beforeEach(() => {
            vi.spyOn(navigator.credentials, 'get').mockResolvedValue({
              type: 'public-key',
              rawId: uint8ArrayToBuffer(new Uint8Array([1, 2, 3])),
              response: {
                clientDataJSON: uint8ArrayToBuffer(stringToUint8Array('{"type":"webauthn.get"}')),
                authenticatorData: new ArrayBuffer(8),
                signature: uint8ArrayToBuffer(new Uint8Array([9, 9]))
              }
            } as unknown as PublicKeyCredential);
          });

          describe('Success', () => {
            it('should sign successfully and emit progress', async () => {
              const onProgress = vi.fn();

              const identity = await WebAuthnIdentity.createWithExistingCredential({
                retrievePublicKey,
                onProgress
              });

              const signature = await identity.sign(new Uint8Array([4, 4, 4, 5, 5, 5]));
              expect(signature).toBeInstanceOf(Uint8Array);

              expect(retrievePublicKey).toHaveBeenCalledTimes(1);

              const calls = onProgress.mock.calls.map((c) => c[0]);

              expect(calls).toEqual([
                {step: WebAuthnSignProgressStep.RequestingUserCredential, state: 'in_progress'},
                {step: WebAuthnSignProgressStep.RequestingUserCredential, state: 'success'},
                {step: WebAuthnSignProgressStep.FinalizingCredential, state: 'in_progress'},
                {step: WebAuthnSignProgressStep.FinalizingCredential, state: 'success'},
                {step: WebAuthnSignProgressStep.Signing, state: 'in_progress'},
                {step: WebAuthnSignProgressStep.Signing, state: 'success'}
              ]);
            });

            it('should create credential with dedicated class type', async () => {
              const identity = await WebAuthnIdentity.createWithExistingCredential({
                retrievePublicKey,
                onProgress: vi.fn()
              });

              await identity.sign(new Uint8Array([4, 4, 4, 5, 5, 5]));

              expect(identity.getCredential()).toBeInstanceOf(WebAuthnExistingCredential);
            });
          });

          describe('Errors', () => {
            it('should throw error when getting credential if identity not yet signed', async () => {
              const identity = await WebAuthnIdentity.createWithExistingCredential({
                retrievePublicKey,
                onProgress: vi.fn()
              });

              expect(() => identity.getCredential()).toThrow(
                WebAuthnIdentityCredentialNotInitializedError
              );
            });
          });
        });

        describe('Errors', () => {
          it('should throw when navigator.credentials.get returns null', async () => {
            vi.spyOn(navigator.credentials, 'get').mockResolvedValue(
              null as unknown as PublicKeyCredential
            );

            const identity = await WebAuthnIdentity.createWithExistingCredential({
              retrievePublicKey
            });

            await expect(identity.sign(new Uint8Array([1, 2, 3, 444]))).rejects.toBeInstanceOf(
              WebAuthnIdentityCreateCredentialOnTheDeviceError
            );
          });

          it('should throw when credential type is not public-key', async () => {
            vi.spyOn(navigator.credentials, 'get').mockResolvedValue({
              type: 'password'
            } as unknown as PublicKeyCredential);

            const identity = await WebAuthnIdentity.createWithExistingCredential({
              retrievePublicKey
            });

            await expect(identity.sign(new Uint8Array([1, 2, 3, 444]))).rejects.toBeInstanceOf(
              WebAuthnIdentityCredentialNotPublicKeyError
            );
          });

          it('should throw when authenticatorData is missing', async () => {
            vi.spyOn(navigator.credentials, 'get').mockResolvedValue({
              type: 'public-key',
              rawId: uint8ArrayToBuffer(new Uint8Array([1, 2, 3])),
              response: {
                clientDataJSON: uint8ArrayToBuffer(stringToUint8Array('{}')),
                signature: uint8ArrayToBuffer(new Uint8Array([1]))
              }
            } as unknown as PublicKeyCredential);

            const identity = await WebAuthnIdentity.createWithExistingCredential({
              retrievePublicKey
            });

            await expect(identity.sign(new Uint8Array([1, 2, 3, 444]))).rejects.toBeInstanceOf(
              WebAuthnIdentityNoAuthenticatorDataError
            );
          });

          it('should throw when signature is missing', async () => {
            vi.spyOn(navigator.credentials, 'get').mockResolvedValue({
              type: 'public-key',
              rawId: uint8ArrayToBuffer(new Uint8Array([1, 2, 3])),
              response: {
                clientDataJSON: uint8ArrayToBuffer(stringToUint8Array('{}')),
                authenticatorData: new ArrayBuffer(2)
              }
            } as unknown as PublicKeyCredential);

            const identity = await WebAuthnIdentity.createWithExistingCredential({
              retrievePublicKey
            });

            await expect(identity.sign(new Uint8Array([1, 2, 3, 444]))).rejects.toBeInstanceOf(
              WebAuthnIdentityNoAuthenticatorDataError
            );
          });

          it('should throw on second sign when credential id mismatches after initialization', async () => {
            const firstGet = vi.spyOn(navigator.credentials, 'get');
            firstGet.mockResolvedValueOnce({
              type: 'public-key',
              rawId: uint8ArrayToBuffer(new Uint8Array([1, 2, 3])),
              response: {
                clientDataJSON: uint8ArrayToBuffer(stringToUint8Array('{}')),
                authenticatorData: new ArrayBuffer(2),
                signature: uint8ArrayToBuffer(new Uint8Array([1]))
              }
            } as unknown as PublicKeyCredential);

            const identity = await WebAuthnIdentity.createWithExistingCredential({
              retrievePublicKey
            });

            await identity.sign(new Uint8Array([1, 2, 3, 444]));

            firstGet.mockResolvedValueOnce({
              type: 'public-key',
              rawId: uint8ArrayToBuffer(new Uint8Array([9, 9, 9])),
              response: {
                clientDataJSON: uint8ArrayToBuffer(stringToUint8Array('{}')),
                authenticatorData: new ArrayBuffer(2),
                signature: uint8ArrayToBuffer(new Uint8Array([1]))
              }
            } as unknown as PublicKeyCredential);

            await expect(identity.sign(new Uint8Array([1, 2, 3, 444]))).rejects.toBeInstanceOf(
              WebAuthnIdentityInvalidCredentialIdError
            );
          });
        });
      });

      describe('With retrieve public key error', () => {
        it('should bubble retrievePublicKey errors and emit progress error', async () => {
          vi.spyOn(navigator.credentials, 'get').mockResolvedValue({
            type: 'public-key',
            rawId: uint8ArrayToBuffer(new Uint8Array([1, 2, 3])),
            response: {
              clientDataJSON: uint8ArrayToBuffer(stringToUint8Array('{"type":"webauthn.get"}')),
              authenticatorData: new ArrayBuffer(8),
              signature: uint8ArrayToBuffer(new Uint8Array([9, 9]))
            }
          } as unknown as PublicKeyCredential);

          const customErr = new Error('Backend error');

          const retrievePublicKey = vi.fn(async () => {
            throw customErr;
          });

          const onProgress = vi.fn();

          const identity = await WebAuthnIdentity.createWithExistingCredential({
            retrievePublicKey,
            onProgress
          });

          await expect(identity.sign(new Uint8Array([4, 4, 4, 5, 5, 5]))).rejects.toBe(customErr);

          const calls = onProgress.mock.calls.map((c) => c[0]);

          expect(calls).toEqual([
            {step: WebAuthnSignProgressStep.RequestingUserCredential, state: 'in_progress'},
            {step: WebAuthnSignProgressStep.RequestingUserCredential, state: 'success'},
            {step: WebAuthnSignProgressStep.FinalizingCredential, state: 'in_progress'},
            {step: WebAuthnSignProgressStep.FinalizingCredential, state: 'error'}
          ]);

          expect(retrievePublicKey).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
