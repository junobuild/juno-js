/**
 * @vitest-environment jsdom
 */

import * as agent from '@dfinity/agent';
import {Mock} from 'vitest';
import * as agentClone from '../../webauthn/_agent';
import {WebAuthnIdentityCredentialNotInitializedError} from '../../webauthn/errors';
import {WebAuthnIdentity} from '../../webauthn/identity';

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
    it('should create with new credential', async () => {
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
