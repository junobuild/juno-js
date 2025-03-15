import type {RawData, RawUserId} from './schemas/core';
import type {SetDoc} from './schemas/db/sdk';

declare global {
  function __juno_satellite_datastore_raw_data_to_text(data: RawData): string;
  function __juno_satellite_datastore_raw_data_from_text(data: string): RawData;

  function __juno_satellite_datastore_set_doc_store(
    caller: RawUserId,
    collection: string,
    key: string,
    value: Omit<SetDoc, 'key'>
  ): void;

  function __ic_cdk_print(msg: string): void;
}
