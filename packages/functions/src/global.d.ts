import type {RawData, RawPrincipal, RawUserId} from './schemas/core';
import type {SetDoc} from './sdk/schemas/db';

declare global {
  function __juno_satellite_datastore_raw_data_to_text(data: RawData): string;
  function __juno_satellite_datastore_raw_data_from_text(data: string): RawData;

  function __juno_satellite_datastore_set_doc_store(
    caller: RawUserId,
    collection: string,
    key: string,
    value: Omit<SetDoc, 'key'>
  ): void;

  function __ic_cdk_id(): RawPrincipal;
  function __ic_cdk_print(msg: string): void;
  function __ic_cdk_call_raw(
    canisterId: RawPrincipal,
    method: string,
    args: Uint8Array<ArrayBuffer>
  ): Promise<Uint8Array<ArrayBuffer>>;
}
