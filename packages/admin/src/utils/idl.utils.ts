import {IDL} from '@dfinity/candid';
import type {Principal} from '@dfinity/principal';
import type {Controller} from '@junobuild/ic-client/dist/declarations/satellite/satellite.did';

export const encoreIDLUser = (user: Principal): ArrayBuffer =>
  IDL.encode(
    [
      IDL.Record({
        user: IDL.Principal
      })
    ],
    [{user}]
  );

export const encodeAdminAccessKeysToIDL = (controllers: [Principal, Controller][]): ArrayBuffer =>
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
