import {arrayBufferToUint8Array} from '@dfinity/utils';
import {WebAuthnIdentity, WebAuthnNewCredential} from '@junobuild/ic-client/webauthn';
import {toArray} from '@junobuild/utils';
import {mockIdentity, mockUserIdPrincipal} from './core.mock';

export const mockWebAuthnDataProvider = {provider: 'webauthn'};

export const mockWebAuthnDocUserApiObject = {
  owner: mockUserIdPrincipal,
  data: await toArray(mockWebAuthnDataProvider),
  created_at: 0n
};

export const mockWebAuthnPubDer = new Uint8Array([9, 9, 9]).buffer;

export const mockWebAuthnAaguid = [
  0xde, 0xad, 0xbe, 0xef, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b
];

export const mockWebAuthnDocApiObject = {
  owner: mockUserIdPrincipal,
  data: await toArray({
    publicKey: arrayBufferToUint8Array(mockWebAuthnPubDer),
    aaguid: mockWebAuthnAaguid
  }),
  created_at: 0n
};

export const mockCredentialIdText = 'cred-123';

export const mockPasskeyIdentity = {
  ...mockIdentity,
  getPublicKey: () => ({toDer: () => mockWebAuthnPubDer}),
  getCredential: () => ({
    getCredentialIdText: () => mockCredentialIdText,
    getAAGUID: () => mockWebAuthnAaguid
  })
} as unknown as WebAuthnIdentity<WebAuthnNewCredential>;
