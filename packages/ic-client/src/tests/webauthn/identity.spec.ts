/**
 * @vitest-environment jsdom
 */

import * as agent from '@dfinity/agent';
import {beforeEach, Mock} from 'vitest';
import * as agentClone from '../../webauthn/_agent';
import {
  WebAuthnIdentityCreateCredentialOnTheDeviceError,
  WebAuthnIdentityCredentialNotInitializedError,
  WebAuthnIdentityCredentialNotPublicKeyError,
  WebAuthnIdentityInvalidCredentialIdError,
  WebAuthnIdentityNoAttestationError,
  WebAuthnIdentityNoAuthenticatorDataError
} from '../../webauthn/errors';
import {WebAuthnIdentity} from '../../webauthn/identity';
import {WebAuthnSignProgressStep} from '../../webauthn/types/progress';

describe('WebAuthnIdentity', () => {
  let mockedCredentials: CredentialsContainer & {create: Mock; get: Mock};

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
      it('should create a WebAuthnIdentity initialized with new credential', async () => {
        const rawIdBytes = new Uint8Array([1, 2, 3]);
        const attestationObject = new ArrayBuffer(8);

        vi.spyOn(agent.Cbor, 'decode').mockReturnValue({
          authData: new Uint8Array([9, 9, 9])
        } as unknown);
        vi.spyOn(agentClone, '_authDataToCose').mockReturnValue(new Uint8Array([7, 7, 7]));

        const spy = vi.spyOn(navigator.credentials, 'create');
        spy.mockResolvedValue({
          type: 'public-key',
          rawId: rawIdBytes.buffer,
          response: {attestationObject}
        } as unknown as PublicKeyCredential);

        const identity = await WebAuthnIdentity.createWithNewCredential();

        expect(spy).toHaveBeenCalledTimes(1);

        expect(navigator.credentials.create).toHaveBeenCalledTimes(1);
        expect(agent.Cbor.decode).toHaveBeenCalledWith(attestationObject);
        expect(agentClone._authDataToCose).toHaveBeenCalled();

        const cred = identity.getCredential();
        expect(cred.getCredentialId()).toEqual(rawIdBytes);
        expect(identity.getPublicKey()).toBeTruthy();
      });

      it('throws when device returns null', async () => {
        vi.spyOn(navigator.credentials, 'create').mockResolvedValue(null as unknown as Credential);
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

    describe('Sign', () => {
      const enc = (s: string) => new TextEncoder().encode(s);
      const ab = (u8: Uint8Array) => u8.buffer;

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
        vi.spyOn(agent.Cbor, 'encode').mockReturnValue(
          new ArrayBuffer(16) as unknown as ArrayBuffer
        );

        vi.spyOn(navigator.credentials, 'get').mockResolvedValue({
          type: 'public-key',
          rawId: rawIdBytes.buffer,
          response: {
            clientDataJSON: ab(enc('{"type":"webauthn.get"}')),
            authenticatorData: new ArrayBuffer(4),
            signature: ab(new Uint8Array([1]))
          }
        } as unknown as PublicKeyCredential);

        const onProgress = vi.fn();

        const identity = await WebAuthnIdentity.createWithNewCredential({onProgress});

        const signature = await identity.sign(new ArrayBuffer(4));
        expect(signature).toBeInstanceOf(ArrayBuffer);

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
          rawId: ab(new Uint8Array([9, 9, 9])),
          response: {
            clientDataJSON: ab(enc('{}')),
            authenticatorData: new ArrayBuffer(2),
            signature: ab(new Uint8Array([1]))
          }
        } as unknown as PublicKeyCredential);

        const identity = await WebAuthnIdentity.createWithNewCredential();

        await expect(identity.sign(new ArrayBuffer(1))).rejects.toBeInstanceOf(
          WebAuthnIdentityInvalidCredentialIdError
        );
      });

      it('should throw when authenticatorData is missing', async () => {
        vi.spyOn(navigator.credentials, 'get').mockResolvedValue({
          type: 'public-key',
          rawId: rawIdBytes.buffer,
          response: {
            clientDataJSON: ab(enc('{}')),
            signature: ab(new Uint8Array([1]))
          }
        } as unknown as PublicKeyCredential);

        const identity = await WebAuthnIdentity.createWithNewCredential();

        await expect(identity.sign(new ArrayBuffer(1))).rejects.toBeInstanceOf(
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
            clientDataJSON: ab(enc('{}')),
            authenticatorData: new ArrayBuffer(2)
          }
        } as unknown as PublicKeyCredential);

        await expect(identity.sign(new ArrayBuffer(1))).rejects.toBeInstanceOf(
          WebAuthnIdentityNoAuthenticatorDataError
        );
      });
    });
  });

  describe('With existing credential', () => {
    it('should creates with existing credential', async () => {
      const retrievePublicKey = vi.fn(async () => new Uint8Array([1, 2, 3]));

      const identity = await WebAuthnIdentity.createWithExistingCredential({
        retrievePublicKey
      });

      expect(() => identity.getPublicKey()).toThrow(WebAuthnIdentityCredentialNotInitializedError);
      expect(() => identity.getCredential()).toThrow(WebAuthnIdentityCredentialNotInitializedError);
      expect(retrievePublicKey).not.toHaveBeenCalled();
    });
  });
});
