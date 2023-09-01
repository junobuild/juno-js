import {IDL} from '@dfinity/candid';
import type {Principal} from '@dfinity/principal';

export const encoreIDLUser = (user: Principal): ArrayBuffer =>
  IDL.encode(
    [
      IDL.Record({
        user: IDL.Principal
      })
    ],
    [{user}]
  );

export const encodeIDLControllers = <T>(controllers: [Principal, T][]): ArrayBuffer =>
  IDL.encode(
    [
      IDL.Record({
        controllers: IDL.Vec(IDL.Principal)
      })
    ],
    [{controllers: controllers.map(([controller, _]) => controller)}]
  );
