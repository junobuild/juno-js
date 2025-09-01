import {arrayBufferToUint8Array, jsonReviver} from '@dfinity/utils';
import {MockInstance} from 'vitest';
import {createWebAuthnUser} from '../../../auth/services/user-webauthn.services';
import * as actorApi from '../../../core/api/actor.api';
import {mockIdentity, mockSatelliteId, mockUserIdText} from '../../mocks/core.mock';
import {
  mockCredentialIdText,
  mockPasskeyIdentity,
  mockWebAuthnAaguid,
  mockWebAuthnDataProvider,
  mockWebAuthnDocApiObject,
  mockWebAuthnDocUserApiObject,
  mockWebAuthnPubDer
} from '../../mocks/webauthn.mock';

describe('webauthn-user.services', async () => {
  const delegationIdentity = mockIdentity;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('bubbles set_many_docs errors', async () => {
    const err = new Error('boom');
    const set_many_docs = vi.fn().mockRejectedValue(err);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({set_many_docs} as any);

    await expect(
      createWebAuthnUser({
        delegationIdentity,
        passkeyIdentity: mockPasskeyIdentity,
        satelliteId: mockSatelliteId
      })
    ).rejects.toThrow('boom');
  });

  describe('With set_many_docs success', () => {
    let set_many_docs: MockInstance;

    beforeEach(() => {
      set_many_docs = vi.fn().mockResolvedValue([
        [mockUserIdText, mockWebAuthnDocUserApiObject],
        [mockPasskeyIdentity.getCredential().getCredentialIdText(), mockWebAuthnDocApiObject]
      ]);
      vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({set_many_docs} as any);
    });

    it('calls set_many_docs with #user and #user-webauthn entries and correct keys', async () => {
      await createWebAuthnUser({
        delegationIdentity,
        passkeyIdentity: mockPasskeyIdentity,
        satelliteId: mockSatelliteId
      });

      expect(set_many_docs).toHaveBeenCalledTimes(1);
      const docsArg = set_many_docs.mock.calls[0][0];

      const userEntry = docsArg.find((d) =>
        Array.isArray(d) ? d[0] === '#user' : d?.collection === '#user'
      );
      const webauthnEntry = docsArg.find((d) =>
        Array.isArray(d) ? d[0] === '#user-webauthn' : d?.collection === '#user-webauthn'
      );

      expect(userEntry).toBeTruthy();
      expect(webauthnEntry).toBeTruthy();

      if (Array.isArray(userEntry)) {
        expect(userEntry[1]).toBe(mockUserIdText);
      } else {
        expect(userEntry.doc.key).toBe(mockUserIdText);
      }

      if (Array.isArray(webauthnEntry)) {
        expect(webauthnEntry[1]).toBe(mockCredentialIdText);
      } else {
        expect(webauthnEntry.doc.key).toBe(mockCredentialIdText);
      }
    });

    it('serializes #user payload with provider and providerData.webauthn.aaguid', async () => {
      await createWebAuthnUser({
        delegationIdentity,
        passkeyIdentity: mockPasskeyIdentity,
        satelliteId: mockSatelliteId
      });

      const docsArg: any[] = set_many_docs.mock.calls[0][0];
      const userEntry = docsArg.find((d) =>
        Array.isArray(d) ? d[0] === '#user' : d?.collection === '#user'
      );

      const getDataBuf = (entry: any) => (Array.isArray(entry) ? entry[2]?.data : entry?.doc?.data);
      const buf: Uint8Array = getDataBuf(userEntry);
      const parsed = JSON.parse(new TextDecoder().decode(buf), jsonReviver);

      expect(parsed).toEqual({
        provider: 'webauthn',
        providerData: {
          webauthn: {
            aaguid: mockWebAuthnAaguid
          }
        }
      });
    });

    it('serializes #user-webauthn payload with publicKey (DER→Uint8Array)', async () => {
      await createWebAuthnUser({
        delegationIdentity,
        passkeyIdentity: mockPasskeyIdentity,
        satelliteId: mockSatelliteId
      });

      const docsArg: any[] = set_many_docs.mock.calls[0][0];
      const webauthnEntry = docsArg.find((d) =>
        Array.isArray(d) ? d[0] === '#user-webauthn' : d?.collection === '#user-webauthn'
      );

      const getDataBuf = (entry: any) => (Array.isArray(entry) ? entry[2]?.data : entry?.doc?.data);
      const buf: Uint8Array = getDataBuf(webauthnEntry);
      const parsed = JSON.parse(new TextDecoder().decode(buf), jsonReviver);

      expect(parsed).toEqual({
        publicKey: arrayBufferToUint8Array(mockWebAuthnPubDer)
      });
    });

    it('returns the first doc from actor response as the created user', async () => {
      const user = await createWebAuthnUser({
        delegationIdentity,
        passkeyIdentity: mockPasskeyIdentity,
        satelliteId: mockSatelliteId
      });

      expect(user.key).toBe(mockUserIdText);
      expect(user.data).toStrictEqual(mockWebAuthnDataProvider);
    });
  });
});
