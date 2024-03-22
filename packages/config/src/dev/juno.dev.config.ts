import type {Rule} from '../types/rules';

export type SatelliteDevDbCollection = Omit<Rule, 'createdAt' | 'updatedAt' | 'maxSize'>;

export type SatelliteDevStorageCollection = Omit<Rule, 'createdAt' | 'updatedAt' | 'maxCapacity'>;

export interface SatelliteDevCollections {
  db?: SatelliteDevDbCollection[];
  storage?: SatelliteDevStorageCollection[];
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
