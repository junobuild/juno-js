import {IDL} from '@dfinity/candid';
import {Principal} from '@dfinity/principal';
import {SatelliteDid} from '@junobuild/ic-client/actor';
import {encodeAdminAccessKeysToIDL, encoreIDLUser} from '../../utils/idl.utils';
import {mockSatelliteIdText, mockUserIdText} from '../mocks/admin.mock';

describe('idl-encode.utils', () => {
  describe('encoreIDLUser', () => {
    it('encodes a user principal into candid IDL', () => {
      const principal = Principal.fromText(mockUserIdText);
      const encoded = encoreIDLUser(principal);

      const decoded = IDL.decode([IDL.Record({user: IDL.Principal})], encoded);

      expect(decoded).toEqual([{user: principal}]);
    });
  });

  describe('encodeAdminAccessKeysToIDL', () => {
    const adminPrincipal = Principal.fromText(mockSatelliteIdText);
    const viewerPrincipal = Principal.fromText(mockUserIdText);

    it('encodes only Admin-scoped principals', () => {
      const controllers: [Principal, SatelliteDid.Controller][] = [
        [
          adminPrincipal,
          {
            created_at: 0n,
            updated_at: 0n,
            scope: {Admin: null},
            metadata: [],
            expires_at: []
          }
        ],
        [
          viewerPrincipal,
          {
            created_at: 0n,
            updated_at: 0n,
            scope: {Submit: null},
            metadata: [],
            expires_at: []
          }
        ]
      ];

      const encoded = encodeAdminAccessKeysToIDL(controllers);

      const decoded = IDL.decode([IDL.Record({controllers: IDL.Vec(IDL.Principal)})], encoded);

      expect(decoded).toEqual([{controllers: [adminPrincipal]}]);
    });

    it('returns an empty list if no Admins are present', () => {
      const controllers: [Principal, SatelliteDid.Controller][] = [
        [
          viewerPrincipal,
          {
            scope: {Write: null},
            created_at: BigInt(0),
            updated_at: BigInt(0),
            metadata: [],
            expires_at: []
          }
        ]
      ];

      const encoded = encodeAdminAccessKeysToIDL(controllers);

      const decoded = IDL.decode([IDL.Record({controllers: IDL.Vec(IDL.Principal)})], encoded);

      expect(decoded).toEqual([{controllers: []}]);
    });
  });
});
