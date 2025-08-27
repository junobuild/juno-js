import {uint8ArrayToBase64} from '@dfinity/utils';
import {CosePublicKey} from '../../webauthn/agent';
import {WebAuthnCredential} from '../../webauthn/credential';

describe('WebAuthnCredential', () => {
  const rawId = new Uint8Array([1, 2, 3, 4]);
  const cose = new Uint8Array([5, 6, 7, 8]);

  it('should stores and returns credential ID bytes', () => {
    const cred = new WebAuthnCredential({rawId, cose});
    expect(cred.getCredentialId()).toBe(rawId);
  });

  it('should exposes credential ID as base64 text', () => {
    const cred = new WebAuthnCredential({rawId, cose});
    expect(cred.getCredentialIdText()).toBe(uint8ArrayToBase64(rawId));
  });

  it('should returns a CosePublicKey instance from getPublicKey', () => {
    const cred = new WebAuthnCredential({rawId, cose});
    expect(cred.getPublicKey()).toBeInstanceOf(CosePublicKey);
  });
});
