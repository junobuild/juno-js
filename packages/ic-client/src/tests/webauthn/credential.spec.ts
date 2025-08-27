import {uint8ArrayToBase64} from '@dfinity/utils';
import {CosePublicKey} from '../../webauthn/agent-js/cose-key';
import {WebAuthnExistingCredential, WebAuthnNewCredential} from '../../webauthn/credential';

describe('WebAuthnCredential', () => {
  const rawId = new Uint8Array([1, 2, 3, 4]);
  const cose = new Uint8Array([5, 6, 7, 8]);

  const cases = [
    ['WebAuthnNewCredential', WebAuthnNewCredential],
    ['WebAuthnRetrievedCredential', WebAuthnExistingCredential]
  ] as const;

  cases.forEach(([name, Ctor]) => {
    it(`${name} stores and returns credential ID bytes`, () => {
      const cred = new Ctor({rawId, cose} as any);
      expect(cred.getCredentialId()).toBe(rawId);
    });

    it(`${name} exposes credential ID as base64 text`, () => {
      const cred = new Ctor({rawId, cose} as any);
      expect(cred.getCredentialIdText()).toBe(uint8ArrayToBase64(rawId));
    });

    it(`${name} returns a CosePublicKey from getPublicKey`, () => {
      const cred = new Ctor({rawId, cose} as any);
      expect(cred.getPublicKey()).toBeInstanceOf(CosePublicKey);
    });
  });
});
