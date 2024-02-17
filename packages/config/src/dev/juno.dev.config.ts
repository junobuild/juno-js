import type {Rule} from '../types/rules';

export type SatelliteDevCollection = Omit<Rule, 'created_at' | 'updated_at'>;

export interface SatelliteDevCollections {
  db?: SatelliteDevCollection[];
  storage?: SatelliteDevCollection[];
}

export interface SatelliteDevController {
  id: string;
  scope: 'write' | 'admin';
}

export interface SatelliteDevConfig {
  collections: SatelliteDevCollections;
  controllers?: SatelliteDevController[];
}

export interface JunoDevConfig {
  satellite: SatelliteDevConfig;
}
