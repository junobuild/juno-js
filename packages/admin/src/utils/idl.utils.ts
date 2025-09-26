import {IDL} from '@icp-sdk/core/candid';
import type {Principal} from '@icp-sdk/core/principal';
import type {SatelliteDid} from '@junobuild/ic-client/actor';

export const encoreIDLUser = (user: Principal): Uint8Array =>
  IDL.encode(
    [
      IDL.Record({
        user: IDL.Principal
      })
    ],
    [{user}]
  );

export const encodeAdminAccessKeysToIDL = (
  controllers: [Principal, SatelliteDid.Controller][]
): Uint8Array =>
  IDL.encode(
    [
      IDL.Record({
        controllers: IDL.Vec(IDL.Principal)
      })
    ],
    [
      {
        controllers: controllers
          .filter(([_, {scope}]) => 'Admin' in scope)
          .map(([controller, _]) => controller)
      }
    ]
  );
