import type {Identity} from '@dfinity/agent';

export interface Satellite {
  identity: Identity;
  satelliteId?: string;
  fetch?: typeof fetch;
  container?: boolean | string;
}

export type SatelliteOptions = Partial<Satellite>;
