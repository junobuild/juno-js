import type {DocContext} from './hooks/schemas/db/context';
import type {DocUpsert} from './hooks/schemas/db/payload';
import type {DelDoc, Doc, OptionDoc, RawData, SetDoc} from './schemas/db';
import type {ListParams, ListResults} from './schemas/list';
import type {Collection, Key, RawPrincipal, RawUserId} from './schemas/satellite';
import type {Controllers} from './sdk/schemas/controllers';

declare global {
  function __juno_satellite_datastore_raw_data_to_text(data: RawData): string;
  function __juno_satellite_datastore_raw_data_from_text(data: string): RawData;

  function __juno_satellite_get_admin_controllers(): Controllers;
  function __juno_satellite_get_controllers(): Controllers;
  function __juno_satellite_is_admin_controller(
    caller: RawUserId,
    controllers: Controllers
  ): boolean;
  function __juno_satellite_is_controller(caller: RawUserId, controllers: Controllers): boolean;

  function __juno_satellite_datastore_count_collection_docs_store(collection: Collection): bigint;
  function __juno_satellite_datastore_count_docs_store(
    caller: RawUserId,
    collection: Collection,
    filter: ListParams
  ): bigint;
  function __juno_satellite_datastore_set_doc_store(
    caller: RawUserId,
    collection: Collection,
    key: Key,
    value: SetDoc
  ): DocContext<DocUpsert>;
  function __juno_satellite_datastore_delete_doc_store(
    caller: RawUserId,
    collection: Collection,
    key: Key,
    value: DelDoc
  ): DocContext<OptionDoc>;
  function __juno_satellite_datastore_delete_docs_store(collection: Collection): void;
  function __juno_satellite_datastore_delete_filtered_docs_store(
    caller: RawUserId,
    collection: Collection,
    filter: ListParams
  ): DocContext<OptionDoc>[];
  function __juno_satellite_datastore_get_doc_store(
    caller: RawUserId,
    collection: Collection,
    key: Key
  ): OptionDoc;
  function __juno_satellite_datastore_list_docs_store(
    caller: RawUserId,
    collection: Collection,
    params: ListParams
  ): ListResults<Doc>;

  function __juno_satellite_storage_count_collection_assets_store(collection: Collection): bigint;
  function __juno_satellite_storage_count_assets_store(
      caller: RawUserId,
      collection: Collection,
      filter: ListParams
  ): bigint;

  function __juno_satellite_random(): number;

  function __ic_cdk_id(): RawPrincipal;
  function __ic_cdk_print(msg: string): void;
  function __ic_cdk_call_raw(
    canisterId: RawPrincipal,
    method: string,
    args: Uint8Array<ArrayBuffer>
  ): Promise<Uint8Array<ArrayBuffer>>;
}
