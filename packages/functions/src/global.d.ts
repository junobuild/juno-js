import type {RawData, RawUserId} from './hooks/core';
import type {SetDoc} from './hooks/sdk';

declare global {
  function __juno_satellite_datastore_raw_data_to_text(data: RawData): string;
  function __juno_satellite_datastore_raw_data_from_text(data: string): RawData;

  function __juno_satellite_datastore_set_doc_store(
    caller: RawUserId,
    collection: string,
    key: string,
    value: SetDoc
  ): void;

  function __ic_cdk_print(msg: string): void;
}
