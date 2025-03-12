import type {RawData} from './hooks/core';

declare global {
  function __juno_satellite_datastore_raw_data_to_text(data: RawData): string;
  function __juno_satellite_datastore_raw_data_from_text(data: string): RawData;
}

