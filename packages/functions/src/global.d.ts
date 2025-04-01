import type {DelDoc, RawData, SetDoc} from './schemas/db';
import type {Collection, Key, RawPrincipal, RawUserId} from './schemas/satellite';
import {Controllers} from './sdk/schemas/controllers';

declare global {
  function __juno_satellite_datastore_raw_data_to_text(data: RawData): string;
  function __juno_satellite_datastore_raw_data_from_text(data: string): RawData;

  function __juno_satellite_datastore_get_admin_controllers(): Controllers;
  function __juno_satellite_datastore_get_controllers(): Controllers;
  function __juno_satellite_datastore_is_admin_controller(
    caller: RawUserId,
    controllers: Controllers
  ): boolean;
  function __juno_satellite_datastore_is_controller(
    caller: RawUserId,
    controllers: Controllers
  ): boolean;

  function __juno_satellite_datastore_set_doc_store(
    caller: RawUserId,
    collection: Collection,
    key: Key,
    value: SetDoc
  ): void;
  function __juno_satellite_datastore_delete_doc_store(
    caller: RawUserId,
    collection: Collection,
    key: Key,
    value: DelDoc
  ): void;

  function __ic_cdk_id(): RawPrincipal;
  function __ic_cdk_print(msg: string): void;
  function __ic_cdk_call_raw(
    canisterId: RawPrincipal,
    method: string,
    args: Uint8Array<ArrayBuffer>
  ): Promise<Uint8Array<ArrayBuffer>>;
}
