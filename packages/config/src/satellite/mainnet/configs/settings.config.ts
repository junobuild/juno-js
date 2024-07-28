export type SatelliteLogVisibility = 'controllers' | 'public';

export interface SatelliteSettings {
  freezingThreshold?: bigint;
  reservedCyclesLimit?: bigint;
  logVisibility?: SatelliteLogVisibility;
  wasmMemoryLimit?: bigint;
  memoryAllocation?: bigint;
  computeAllocation?: bigint;
}
