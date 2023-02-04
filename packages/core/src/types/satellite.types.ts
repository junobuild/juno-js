import type {Identity} from '@dfinity/agent';

export interface Satellite {
  identity: Identity;
  satelliteId?: string;
  fetch?: typeof fetch;
  env?: 'dev' | 'prod';
}

export type SatelliteOptions = Partial<Satellite>;
