import {uint8ArrayToBase64} from '@dfinity/utils';
import {CosePublicKey} from '../../webauthn/agent-js/cose-key';
import {WebAuthnExistingCredential, WebAuthnNewCredential} from '../../webauthn/credential';
import {hexToBytes, makeAuthData} from './_aaguid.mock';

describe('WebAuthnCredential', () => {
  const rawId = new Uint8Array([1, 2, 3, 4]);
  const cose = new Uint8Array([5, 6, 7, 8]);

  describe('WebAuthnExistingCredential', () => {
    it('should stores and returns credential ID bytes', () => {
      const cred = new WebAuthnExistingCredential({rawId, cose});
      expect(cred.getCredentialId()).toBe(rawId);
    });

    it('should expose credential ID as base64 text', () => {
      const cred = new WebAuthnExistingCredential({rawId, cose});
      expect(cred.getCredentialIdText()).toBe(uint8ArrayToBase64(rawId));
    });

    it('should returns a CosePublicKey from getPublicKey', () => {
      const cred = new WebAuthnExistingCredential({rawId, cose});
      expect(cred.getPublicKey()).toBeInstanceOf(CosePublicKey);
    });
  });

  describe('WebAuthnNewCredential', () => {
    const rawId = new Uint8Array([1, 2, 3, 4]);
    const cose = new Uint8Array([5, 6, 7, 8]);

    const aaguid = '00112233-4455-6677-8899-aabbccddeeff';
    const authData = makeAuthData({len: 53, aaguidBytes: hexToBytes({aaguid})});

    it('should stores and returns credential ID bytes', () => {
      const cred = new WebAuthnNewCredential({rawId, cose, authData});
      expect(cred.getCredentialId()).toBe(rawId);
    });

    it('should expose credential ID as base64 text', () => {
      const cred = new WebAuthnNewCredential({rawId, cose, authData});
      expect(cred.getCredentialIdText()).toBe(uint8ArrayToBase64(rawId));
    });

    it('should returns a CosePublicKey from getPublicKey', () => {
      const cred = new WebAuthnNewCredential({rawId, cose, authData});
      expect(cred.getPublicKey()).toBeInstanceOf(CosePublicKey);
    });

    it('should extract AAGUID from attestation authData', () => {
      const authData = makeAuthData({len: 53, aaguidBytes: hexToBytes({aaguid})});
      const cred = new WebAuthnNewCredential({rawId, cose, authData});
      expect(cred.getAAGUID()).toBe(aaguid);
    });

    it('should return undefined for zero/unknown AAGUID', () => {
      const zeros = new Uint8Array(16);
      const authData = makeAuthData({len: 53, aaguidBytes: zeros});
      const cred = new WebAuthnNewCredential({rawId, cose, authData});
      expect(cred.getAAGUID()).toBeUndefined();
    });

    it('should return undefined when authData is too short to contain AAGUID', () => {
      const authData = makeAuthData({len: 52});
      const cred = new WebAuthnNewCredential({rawId, cose, authData});
      expect(cred.getAAGUID()).toBeUndefined();
    });
  });
});
