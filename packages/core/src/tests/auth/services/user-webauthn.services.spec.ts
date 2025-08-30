import {arrayBufferToUint8Array, jsonReviver} from '@dfinity/utils';
import {WebAuthnIdentity, WebAuthnNewCredential} from '@junobuild/ic-client/webauthn';
import {toArray} from '@junobuild/utils';
import {MockInstance} from 'vitest';
import {createWebAuthnUser} from '../../../auth/services/user-webauthn.services';
import * as actorApi from '../../../core/api/actor.api';
import {mockIdentity, mockUserIdPrincipal, mockUserIdText} from '../../mocks/core.mock';

describe('webauthn-user.services', async () => {
  const pubDer = new Uint8Array([9, 9, 9]).buffer;
  const aaguid = '550e8400-e29b-41d4-a716-446655440000';
  const credentialIdText = 'cred-123';
  const satelliteId = 'aaaaa-aa';

  const delegationIdentity = mockIdentity;

  const passkeyIdentity = {
    ...mockIdentity,
    getPublicKey: () => ({toDer: () => pubDer}),
    getCredential: () => ({
      getCredentialIdText: () => credentialIdText,
      getAAGUID: () => aaguid
    })
  } as unknown as WebAuthnIdentity<WebAuthnNewCredential>;

  const mockData = {provider: 'webauthn'};

  const mockDocApiObject = {
    owner: mockUserIdPrincipal,
    data: await toArray(mockData),
    created_at: 0n
  };

  const webauthnDocApiObject = {
    owner: mockUserIdPrincipal,
    data: await toArray({
      publicKey: arrayBufferToUint8Array(pubDer),
      aaguid
    }),
    created_at: 0n
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('bubbles set_many_docs errors', async () => {
    const err = new Error('boom');
    const set_many_docs = vi.fn().mockRejectedValue(err);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({set_many_docs} as any);

    await expect(
      createWebAuthnUser({delegationIdentity, passkeyIdentity, satelliteId})
    ).rejects.toThrow('boom');
  });

  describe('With set_many_docs success', () => {
    let set_many_docs: MockInstance;

    beforeEach(() => {
      set_many_docs = vi.fn().mockResolvedValue([
        [mockUserIdText, mockDocApiObject],
        [passkeyIdentity.getCredential().getCredentialIdText(), webauthnDocApiObject]
      ]);
      vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({set_many_docs} as any);
    });

    it('calls set_many_docs with #user and #user-webauthn entries and correct keys', async () => {
      await createWebAuthnUser({delegationIdentity, passkeyIdentity, satelliteId});

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
        expect(webauthnEntry[1]).toBe(credentialIdText);
      } else {
        expect(webauthnEntry.doc.key).toBe(credentialIdText);
      }
    });

    it('serializes #user-webauthn payload with publicKey (DER→Uint8Array) and aaguid', async () => {
      await createWebAuthnUser({delegationIdentity, passkeyIdentity, satelliteId});

      const docsArg: any[] = set_many_docs.mock.calls[0][0];
      const webauthnEntry = docsArg.find((d) =>
        Array.isArray(d) ? d[0] === '#user-webauthn' : d?.collection === '#user-webauthn'
      );

      const getDataBuf = (entry: any) => (Array.isArray(entry) ? entry[2]?.data : entry?.doc?.data);
      const buf: Uint8Array = getDataBuf(webauthnEntry);
      const parsed = JSON.parse(new TextDecoder().decode(buf), jsonReviver);

      expect(parsed).toEqual({
        publicKey: arrayBufferToUint8Array(pubDer),
        aaguid
      });
    });

    it('returns the first doc from actor response as the created user', async () => {
      const user = await createWebAuthnUser({delegationIdentity, passkeyIdentity, satelliteId});

      expect(user.key).toBe(mockUserIdText);
      expect(user.data).toStrictEqual(mockData);
    });
  });
});
