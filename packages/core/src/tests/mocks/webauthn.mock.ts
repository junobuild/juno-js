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

export const mockWebAuthnAaguid = '550e8400-e29b-41d4-a716-446655440000';

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
